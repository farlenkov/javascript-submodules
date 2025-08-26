import Provider from './provider.js';

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
        return `https://generativelanguage.googleapis.com/v1beta/models?key=${this.settings.googleKey}`;
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
            "x-goog-api-key" : this.settings.googleKey
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

        return data.candidates[0].content.parts.map(part => part.text);
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
            "Sulafat"];
    }

    async Speak(model, voice, text)
    {
        try 
        {
            // new Notice('Generating speech...');

            const response = await this.callTTS(model, voice, text);
            
            if (response && response.audioContent) 
            {
                await this.playAudio(response.audioContent, response.mimeType);
                // new Notice('Speech generated successfully');
            } 
            else 
            {
                // new Notice('Failed to generate speech');
            }
        } 
        catch (error) 
        {
            console.error('TTS Error:', error);
            // new Notice(`TTS Error: ${error.message}`);
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
                'x-goog-api-key': this.settings.googleKey,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) 
        {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("response.json()", data);
        
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

    async playAudio(base64AudioData, mimeType) 
    {
        try 
        {
            const arrayBuffer  = this.base64ToArrayBuffer(base64AudioData);
            const pcmData = new Int16Array(arrayBuffer); 
            const wavBlob = this.pcmToWav(pcmData, 24000);
            const audioUrl = URL.createObjectURL(wavBlob);

            const audio = new Audio(audioUrl);
            await audio.play();

            audio.onended = () => 
            {
                URL.revokeObjectURL(audioUrl);
            };
            
            audio.onerror = (error) => 
            {
                console.error('Audio playback error:', error);
                new Notice('Error playing audio');
                URL.revokeObjectURL(audioUrl);
            };
            
            await audio.play();
            
        } 
        catch (error) 
        {
            console.error('Audio processing error:', error);
            new Notice('Error processing audio');
        }
    }

    base64ToArrayBuffer(base64) 
    {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) 
            bytes[i] = binaryString.charCodeAt(i);
        
        return bytes.buffer;
    }

    pcmToWav(pcmData, sampleRate = 24000) 
    {
        const buffer = new ArrayBuffer(44 + pcmData.length * 2);
        const view = new DataView(buffer);

        // RIFF identifier
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + pcmData.length * 2, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, 1, true); // mono
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); // byte rate
        view.setUint16(32, 2, true); // block align
        view.setUint16(34, 16, true); // bits per sample
        this.writeString(view, 36, 'data');
        view.setUint32(40, pcmData.length * 2, true);

        let offset = 44;

        for (let i = 0; i < pcmData.length; i++, offset += 2)
            view.setInt16(offset, pcmData[i], true);
        
        return new Blob([view], { type: "audio/wav" });
    }

    writeString(view, offset, string) 
    {
        for (let i = 0; i < string.length; i++) 
            view.setUint8(offset + i, string.charCodeAt(i));        
    }
}