

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("profileDropdown");
    
    //toggles dropdown visibility when profile pic is clicked
    document.querySelector(".profile-icon").addEventListener("click", function(event) { 
        
        if (dropdown) { 
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        }
    });

    window.onclick = function(event) { //hides dropdown if clicked off it

        if (dropdown && !event.target.closest('.profile')) {
            dropdown.style.display = "none";
        }
    };

});



function logout() {  //for the logout button in the dropdown
    window.location.href = "login.html";
}
