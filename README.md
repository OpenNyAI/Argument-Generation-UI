# Argument Generation UI

Argument Generation is a system, used in legal space, that helps to take in the facts, issues, applicable sections and precedents for a case and using them generate arguments for the petitioner or the respondent of the case.

# 🔧 1. Installation

To use the code, you need to follow these steps:

1. Clone the repository from GitHub: 
    
```bash
    git clone git@github.com:OpenNyAI/labelling-ui.git
```

2. Install the dependencies

```bash
    yarn install 
```

3. create a  **.env** file and in the root folder and add the variable REACT_APP_URL with the needed backend url
    Backend code is available in the repo: https://github.com/OpenNyAI/jugalbandi/tree/main/jb-labeling-service
    Run the backend code in your local system and use the url as the backend url in the env file

#  2. Running
    Once the above installation steps are completed, run the following command in the root folder of the repository in terminal, to start the application

```bash
    yarn start
```

# 📃 3. Specification and Documentation
- All the source code is within `/src` folder.
- There are two types of routes 
    - Routes that does not require authentication. Listed in App.tsx
        - **Login** - `/login` Where the user can login with their credentials. The code for the page is present in the `/src/components/LoginPage.tsx`
        - **Sign up** - `/signup` Where the user can create a new profile. The code for the page is present in the `/src/components/SignUpPage.tsx`
    - Routes that required authentication. Listed in `/src/Routes/RoutesAuthorised.tsx`. Under this contains
        - **Home Page** - `/homepage` Where the user will be shown a search bar from with the user can choose a perticular case. The code for the page is present in the `/src/components/Layout.tsx`
        - **Facts Page** - `/facts` Where the user will be displayed with the facts of the case and can edit it if needed. The code for the page is presented in `/src/componets/FactsPage.tsx`
        - **Issues Page** - `/issues` Where the user will be displayed with the issues of the case and can edit it if needed. Also an additional option for the system to generate the issues. The code for the page is presented in `/src/components/IssuesPage.tsx`
        - **Statutes Page** - `/statutes` Where the user will be displayed with the applicable sections for the perticular case and can edit the same. The user can add more sections to the same. The code for the same is presented in `/src/components/StatuesPage.tsx`
        - **Precedent Page** - `/precedent` Where the user will be displayed with the relevent precedents for the perticular page. The user can edit or add more to the list of precedents present. The code for the same is present in `src/components/PrecedentPage.tsx`
        - **Arguments Page** - `/arguments` Where the user will be displayed with the arguments for the petitioner and the respondent. The user can choose to edit the same or make the system generate arguments. The code for the same is present in `src/components/ArgumentsPage`

