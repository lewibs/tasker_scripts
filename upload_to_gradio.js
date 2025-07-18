async function uploadAudioGradio() {
    const url = local("%upload_url");
    const filePath = local("%file_path");
    const fileData = await readFile(filePath);
    const audioFile = new Blob([fileData], { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('files', audioFile, 'audio.wav');
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    setLocal("%uploaded_file", result[0]);
    exit();
}

uploadAudioGradio()