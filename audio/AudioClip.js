export default class AudioClip
{
    constructor(wavBlob)
    {
        this.wavBlob = wavBlob;
    }

    async Play()
    {
        this.Stop();
        
        try
        {
            this.audioUrl = URL.createObjectURL(this.wavBlob);
            this.audio = new Audio(this.audioUrl);

            this.audio.onended = () => 
            {
                this.Stop();
            };
            
            this.audio.onerror = (error) => 
            {
                console.error('Audio playback error:', error);
                this.Stop();
            };
            
            await this.audio.play();

            while (this.audio && !this.audio.ended)
                await new Promise((resolve) => setTimeout(resolve, 1));
        }
        catch(ex)
        {
            this.Stop();
            throw ex;
        }
    }

    async Stop()
    {
        if (this.audioUrl)
        {
            URL.revokeObjectURL(this.audioUrl);
            delete this.audioUrl;
            delete this.audio;
        }
    }
}

AudioClip.fromBase64 = (base64AudioData) => 
{
    const arrayBuffer  = base64ToArrayBuffer(base64AudioData);
    const pcmData = new Int16Array(arrayBuffer); 
    const wavBlob = pcmToWav(pcmData, 24000);

    return new AudioClip(wavBlob);
}

function base64ToArrayBuffer(base64) 
{
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) 
        bytes[i] = binaryString.charCodeAt(i);
    
    return bytes.buffer;
}

function pcmToWav(pcmData, sampleRate = 24000) 
{
    const buffer = new ArrayBuffer(44 + pcmData.length * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, 'data');
    view.setUint32(40, pcmData.length * 2, true);

    let offset = 44;

    for (let i = 0; i < pcmData.length; i++, offset += 2)
        view.setInt16(offset, pcmData[i], true);
    
    return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, string) 
{
    for (let i = 0; i < string.length; i++) 
        view.setUint8(offset + i, string.charCodeAt(i));        
}