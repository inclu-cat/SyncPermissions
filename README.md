# SyncPermissions
A tiny tool to synchronize permissions for Google Drive.  

The original spreadsheet is [here](https://docs.google.com/spreadsheets/d/14gK7-0lyG5L-zQ0pZhnK7zy4oSldMN1HOdmm3RUJrVI/edit?usp=sharing).  
Related article is [here](https://inclu-cat.net/2022/02/15/google-drive-a-tiny-tool-to-synchronize-permissions/).

![image](https://user-images.githubusercontent.com/82203087/153862671-f491f648-2e2e-41ab-a5a5-1c0af28051c7.png)

# What is this?
This is a tool to manage and synchronize each user's permissions to various resources in Google Drive.

# How to use?
## 1. Copy the original spreadsheet (only once).
Open [this spreadsheat](https://docs.google.com/spreadsheets/d/14gK7-0lyG5L-zQ0pZhnK7zy4oSldMN1HOdmm3RUJrVI/edit?usp=sharing), click [File]-[Make a copy], and save it to your Google Drive with a name of your choice. (You must be signed in with a Google account.)

<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/153865734-9efdf9f4-8598-4cf7-9ab4-c0651c3c845b.png">
<br>
<br>

ℹ️ If you want to copy the spreadsheet directly into your "My Drive", click on [this link](https://docs.google.com/spreadsheets/d/14gK7-0lyG5L-zQ0pZhnK7zy4oSldMN1HOdmm3RUJrVI/copy).
<br>
<br>

## 2. Enter the resources to be managed
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/153865901-a44ad1ee-45da-40fb-9c16-314444d634a3.png">

Enter the ID of the file or folder you want to manage in the resource id line. (resource name is optional.)  
You need to be an owner of those files or folders.  

How do you know the ID of a file or folder?  
The ID is a part of the URL when you've opened the file.  

**For example:**  
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/153867848-4a082482-067c-4ce4-addd-04d30062114f.png">

⚠️**Caution:**  
If you want to set permissions for both the parent folder and child folders or files, enter the parent on the left side of the column so that the parent is processed first.

## 3. Enter the users to be managed
Enter the Gmail addresses of the users you want to manage.  
<img width="400" alt="image" src="https://user-images.githubusercontent.com/82203087/153868810-4260d25a-ddef-4769-8a64-850e8fbb932d.png">

## 4. Enter the permissions for each user
Enter the character you want to set in each cell.  
* **R**: read only (=viewer)
* **W**: writable (=editor)  
* **[Empty]**: no access **(the access rights will be removed.)**

## 5. Click the Run button
When you are ready, press the Run button to run the program.  
<img width="400" alt="image" src="https://user-images.githubusercontent.com/82203087/153869765-692fbff3-42f8-45e7-93de-735ccad3c6d5.png">

## 6. Authorize the script to run (only once)
The first time you run it, you will see a dialog asking for permission to run the script.  
Follow the steps below to allow the script to run.
* Click `Continue`
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/124216139-7901b400-db30-11eb-8779-64ee5d08b5e5.png">

* Select your account (Perhaps it will be a different procedure for signing in.)
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/153871371-7675923e-e0ab-41f8-916e-a0e9161dfd91.png">

* Click `Advanced`.
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/124218572-72297000-db35-11eb-8415-7fea148d679a.png">

* Click `Go to SyncPermissions (unsafe)`.
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/153871819-ff864c04-ecb0-4bb6-a65c-03c0a3c7567c.png">

* Click `Allow`.
<img width="700" alt="image" src="https://user-images.githubusercontent.com/82203087/153872372-76e2a844-8cc1-4eb6-9f23-0d8158f3314d.png">

* Then click Run button again.

  **Don't worry about the word "unsafe". It's a dialog that all of us face when running our personal scripts.👍**


## 7. Click `OK`
<img width="354" alt="image" src="https://user-images.githubusercontent.com/82203087/154686255-b5c46641-ae8a-48c6-8845-7cf5e3a8fb04.png">
Check "Process only the selected range" if you want to process only the settings of the selected range.

## 8. Wait until the process is done
<img width="491" alt="image" src="https://user-images.githubusercontent.com/82203087/153882197-230752fb-290d-43a4-bd0c-3a87965a8858.png">

When mini-console shows Done, All processing will have completed.  
This tool uses the [LongRun class](https://github.com/inclu-cat/LongRun) to be able to handle a large number of settings; if you see 'Pausing for long processing time...', the process will resume after a minute or so.

