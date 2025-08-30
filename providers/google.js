import Provider from './provider.js';
import AudioClip from '../audio/AudioClip.js';

export default class Google extends Provider
{
    id = "google";
    name = "Google";
    keys = "https://aistudio.google.com/app/apikey";
    models = "https://ai.google.dev/gemini-api/docs/pricing";

    constructor(settings)
    {
        super();
        this.settings = settings;
    }

    // https://ai.google.dev/api/models#models_list-SHELL

    GetFetchUrl()
    {
        return "https://generativelanguage.googleapis.com/v1beta/models?key=" + this.getKey("Models");
    }

    GetFetchHeaders()
    {
        return {};
    }

    ReadModels(data)
    {
        const result = [];

        data.models.forEach(model => 
        {
            if (model.supportedGenerationMethods.indexOf('generateContent') < 0)
                return;

            result.push(
            { 
                id : model.name.replace("models/", ""),
                name : model.displayName,
                desc : model.description,
                owner : this.name,
                context : model.inputTokenLimit,
                prompt : -1,
                completion : -1
            })
        });

        return result;
    }

    GetModelUrl(model)
    {
        return `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent`;
    }

    GetModelHeaders()
    {
        return {
            "Content-Type" : "application/json",
            "x-goog-api-key" : this.getKey("Text")
        };
    }

    ReadMessages(nodes)
    {
        const messages = [];

        nodes.forEach(node => 
        {
            let message = 
            { 
                parts : [],
                role :  node.role == "system" ? "user" : node.role
            };

            node.content.forEach(content =>
            {
                message.parts.push
                ({
                    text : node.role == "system" ? `*${content}*` : content
                }); 
            });

            messages.push(message);
        });

        return messages;
    }

    GetModelBody(model, messages)
    {
        const body = 
        {
            contents : messages,
            generationConfig : {},  
            safetySettings : 
            [{ 
                category : "HARM_CATEGORY_SEXUALLY_EXPLICIT", 
                threshold : "BLOCK_NONE" 
            }]
        };

        body.generationConfig.thinkingConfig = { includeThoughts : true };
        return body;
    }

    ReadResponse(data)
    {            
        if (!data?.candidates?.[0]?.content?.parts)
            return [""];

        let text = "";
        let thought = "";

        data.candidates[0].content.parts.forEach(part => 
        {
            if (!part.thought)
                text = part.text;
            else
                thought = part.text;
        });

        if (thought)
            return [text, thought];
        else
            return [text];
    }

    // SPEAK

    GetVoices()
    {
        return [
            "Zephyr",
            "Puck",
            "Charon",
            "Kore",
            "Fenrir",
            "Leda",
            "Orus",
            "Aoede",
            "Callirrhoe",
            "Autonoe",
            "Enceladus",
            "Iapetus",
            "Umbriel",
            "Algieba",
            "Despina",
            "Erinome",
            "Algenib",
            "Rasalgethi",
            "Laomedeia",
            "Achernar",
            "Alnilam",
            "Schedar",
            "Gacrux",
            "Pulcherrima",
            "Achird",
            "Zubenelgenubi",
            "Vindemiatrix",
            "Sadachbia",
            "Sadaltager",
            "Sulafat"].sort();
    }

    async Speak(model, voice, text)
    {
        try 
        {
            const response = await this.callTTS(model, voice, text);
            
            if (response && response.audioContent) 
            {
                return AudioClip.fromBase64(response.audioContent, response.mimeType);
            } 
            else 
            {
                // new Notice('Failed to generate speech');
            }
        } 
        catch (error) 
        {
            console.error('TTS Error:', error);
        }
    }

    async callTTS(model, voice, text) 
    {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        
        const requestBody = 
        {
            model : model,

            contents: [{
                parts: [{
                    text: text
                }]
            }],

            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig:{
                        prebuiltVoiceConfig : {
                            voiceName: voice
                        }
                    }
                }
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.getKey("Voice"),
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) 
        {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content) 
        {
            const parts = data.candidates[0].content.parts;

            return { 
                audioContent: parts[0].inlineData.data, 
                mimeType: parts[0].inlineData.mimeType 
            };
        }
        
        throw new Error('No audio content found in response');
    }
}