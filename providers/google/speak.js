import AudioClip from '../../audio/AudioClip.js';

class GoogleSpeak
{
    getVoices()
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

    async Spspeakpeakeak(model, voice, text)
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
            contents : [{ parts : [{ text : text }] }],

            generationConfig : 
            {
                responseModalities: ["AUDIO"],                
                speechConfig : { voiceConfig : { prebuiltVoiceConfig : { voiceName : voice }}}
            }
        };

        const response = await fetch(url, 
        {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers : 
            {
                'Content-Type' : 'application/json',
                'x-goog-api-key' : this.getKey("Voice"),
            }
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
                mimeType: parts[0].inlineData.mimeType };
        }
        
        throw new Error('No audio content found in response');
    }
}