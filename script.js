document.getElementById('selfieForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const employeeIdInput = document.getElementById('employeeId');
    const fileInput = document.getElementById('selfie');
    const employeeId = employeeIdInput.value;
    const file = fileInput.files[0];

    if (!employeeId || !file) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        // Fetch the user's IP address
        const ipResponse = await fetch('/api/get-ip'); // Endpoint to get client's IP
        const { ip } = await ipResponse.json();

        // Define the office IP prefix
        const OFFICE_IP_PREFIX = '171.79.49.85';

        // Check if the IP address starts with the office prefix
        if (ip.startsWith(OFFICE_IP_PREFIX)) {
            const formData = new FormData();
            formData.append('employeeId', employeeId);
            formData.append('selfie', file);

            try {
                const response = await fetch('/api/attendance', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Selfie uploaded successfully!');
                } else {
                    alert('Error uploading selfie.');
                }
            } catch (error) {
                console.error('Error uploading selfie:', error);
                alert('Error uploading selfie. Please try again later.');
            }
        } else {
            // IP is not from the office network
            alert('Access denied. You must be connected to the office network to submit this form.');
        }
    } catch (error) {
        console.error('Error fetching IP:', error);
        alert('Unable to determine IP address. Please try again later.');
    }
});
