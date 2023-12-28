# BetterFocus
A chrome extension to block websites and keep focus while working and still have access to them for work stuff.

## Features

- **Website Blocking**: The extension can block specified websites during certain hours of the day. The blocked hours are currently set to 9:00-17:00.
- **Custom Messages**: The extension displays a series of custom prompts when a user tries to access a blocked website. These prompts ask the user to confirm their intent to access the website.
- **Timer Feature**: The extension includes a timer feature that forces the user to wait for a certain duration before accessing the blocked website. The timer is currently set to 15 seconds.

## Usage
1. **Adding a Website**: Enter the URL of the website you want to block in the input field and click on the "Add" button. The website will be added to the list of blocked sites. The blocked site's details, including a series of prompts and a timer, will be stored in the Chrome local storage.
2. **Customizing the prompts, questions and answers**: After having added a site to the list you can customize the prompts, answers, questions, timers and gif by clicking on it. You can also customize which hours you are not allowed to access the site a.k.a your work hours (default is 09 - 17).
3. **Accessing a site**: When you try to access a site it will show you the custom prompts, answers, questions, timers and gif that you set up before.
