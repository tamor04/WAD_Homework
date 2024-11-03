async function fetchAndDisplayPosts() {
    try {
        /*const response = await fetch('https://gist.githubusercontent.com/MihkelTonisson/41e636c391d568c3d7fd2731a346bff3/raw');
        if (!response.ok) throw new Error('Failed to fetch data');

        const posts = await response.json();
        const container = document.querySelector('.posts');

        console.log(posts);*/
        
const response = await fetch("json.json");
        if (!response.ok) throw new Error('Failed to fetch data');

       
        const posts = await response.json();
        const container = document.querySelector('.posts');

        posts.forEach(post => {

            // Create main post container
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            // Profile Picture and Author
            const profileDiv = document.createElement('div');
            profileDiv.classList.add('profile-section');

            const profilePic = document.createElement('img');
            profilePic.src = post.profile_pic;
            profilePic.alt = `${post.author}'s profile picture`;
            profilePic.classList.add('post-profile-icon');
            profilePic.onerror = () => profilePic.src = 'https://via.placeholder.com/150'; // Placeholder if image fails to load

            const author = document.createElement('p');
            author.textContent = post.author;

            profileDiv.appendChild(profilePic);
            profileDiv.appendChild(author);
            postDiv.appendChild(profileDiv);

            // Title and Content
            const title = document.createElement('h3');
            title.classList.add('post-title');
            title.textContent = post.title;
            postDiv.appendChild(title);

            const content = document.createElement('p');
            content.classList.add('post-content');
            content.textContent = post.content;
            postDiv.appendChild(content);

            if (post.post_pic != "") {
                // Post Picture
                const postPic = document.createElement('img');
                postPic.src = post.post_pic;
                postPic.alt = `${post.title} image`;
                postPic.classList.add('post-image');

                // Add fallback for loading errors
                postPic.onerror = () => {
                    postPic.src = "https://www.pngall.com/wp-content/uploads/2016/04/Banana-PNG-File.png";
                    console.error(`Failed to load image for post: ${post.title}`);
                };
                postDiv.appendChild(postPic);
            }
            
            // Create Date
            const date = document.createElement('p');
            date.classList.add('post-date');
            date.textContent = `Posted on: ${post.create_date}`;
            postDiv.appendChild(date);

            // Like Button
            if (post.like_btn) {
                const likeButton = document.createElement('button');
                likeButton.textContent = "Like 🍌";
                likeButton.classList.add('like-btn');
                postDiv.appendChild(likeButton);
            }

            // Append post container to main container
            container.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Call the function to fetch and display posts
fetchAndDisplayPosts();
