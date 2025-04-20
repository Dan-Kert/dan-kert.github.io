async function uploadImage(file) {
    const uploadTask = storage.ref(`images/${Date.now()}_${file.name}`).put(file);
    
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload: ${progress}%`);
        },
        (error) => {
            console.error("Upload error:", error);
        },
        async () => {
            const url = await uploadTask.snapshot.ref.getDownloadURL();
            await db.collection("messages").add({
                imageUrl: url,
                userId: auth.currentUser.uid,
                timestamp: new Date()
            });
        }
    );
}
