// Tasker JavaScriptlet: Upload file to Gradio Space
// Variables needed:
// %file_path - Path to the file you want to upload
// %gradio_url - Gradio space upload URL (optional, defaults to whisper space)

async function uploadToGradio() {
    try {
        // Get variables from Tasker
        const filePath = global('file_path');
        const gradioUrl = global('gradio_url') || 'https://lewibs-whisper.hf.space/gradio_api/upload';
        
        // Validate inputs
        if (!filePath) {
            throw new Error('file_path variable is required');
        }
        
        console.log('Uploading file:', filePath);
        console.log('To URL:', gradioUrl);
        
        // Read the file from device storage
        const fileData = await window.fs.readFile(filePath);
        
        // Create blob with appropriate MIME type based on file extension
        let mimeType = 'application/octet-stream';
        if (filePath.toLowerCase().includes('.wav')) {
            mimeType = 'audio/wav';
        } else if (filePath.toLowerCase().includes('.mp3')) {
            mimeType = 'audio/mpeg';
        } else if (filePath.toLowerCase().includes('.m4a')) {
            mimeType = 'audio/mp4';
        } else if (filePath.toLowerCase().includes('.flac')) {
            mimeType = 'audio/flac';
        }
        
        const fileName = filePath.split('/').pop(); // Extract filename from path
        const audioFile = new Blob([fileData], { type: mimeType });
        
        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append('files', audioFile, fileName);
        
        console.log('Uploading file with MIME type:', mimeType);
        
        // Upload to Gradio
        const response = await fetch(gradioUrl, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }
        
        // Parse response
        const result = await response.json();
        
        if (Array.isArray(result) && result.length > 0) {
            const serverPath = result[0];
            
            // Save results to Tasker variables
            setGlobal('upload_success', 'true');
            setGlobal('server_path', serverPath);
            setGlobal('upload_response', JSON.stringify(result));
            setGlobal('upload_error', '');
            
            console.log('Upload successful!');
            console.log('Server path:', serverPath);
            
        } else {
            throw new Error('Unexpected response format: ' + JSON.stringify(result));
        }
        
    } catch (error) {
        console.error('Upload failed:', error.message);
        
        // Save error info to Tasker variables
        setGlobal('upload_success', 'false');
        setGlobal('server_path', '');
        setGlobal('upload_response', '');
        setGlobal('upload_error', error.message);
    }
}

// Execute the upload
uploadToGradio();