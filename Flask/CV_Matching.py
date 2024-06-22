import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Sample job description and CVs (you should have a list of CVs)


def preprocess_text(text):
    # Remove extra line breaks and leading/trailing whitespaces
    cleaned_text = " ".join(text.split())
    return cleaned_text

def rank_applicants(job_description, applicants):
    # print('rank_applicants')
    # print(job_description,applicants)
    # Preprocess the job description and applicants' resumes using spaCy
    job_description = nlp(preprocess_text(job_description))
    resumes = [nlp(preprocess_text(applicant["resume"])) for applicant in applicants]

    # Calculate TF-IDF vectors
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([job_description.text] + [resume.text for resume in resumes])

    # Calculate cosine similarity
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Rank applicants based on cosine similarity
    applicant_scores = list(zip(range(1, len(cosine_similarities) + 1), cosine_similarities))
    applicant_scores.sort(key=lambda x: x[1], reverse=True)

    # Assign rankings to each applicant
    for i, score in enumerate(applicant_scores):
        applicants[score[0] - 1]["ranking"] = i + 1

    # Select the top 10 applicants
    top_10_applicants = [applicant for applicant in applicants if "ranking" in applicant][:10]

    print(top_10_applicants)
    # Return the ranked list of applicants
    return top_10_applicants

job_description = "Looking for a software engineer with experience in machine learning and natural language processing."
applicants =[{'id': '65d0f79b203998b62f9be924', 'name': 'muhammad abdullah', 'phoneNumber': '3101404487', 'email': 'hafizzabdullah999@gmail.com', 'password': '$2b$10$5rRTQgmlm9klRHc0wZZ0yO7GK1IWMXnUnvBarJNujOfPbu.GHZPqS', 'resume': "\n\nContact\nEducation\n+923101404487\nPhone\nhafizzabdullah999@gmail.com\nEmail\nwww.linkedin.com/in/hafiz-muhammad-\nabdullah-\nLinkedin\nMUHAMMAD ABDULLAH\nSOFTWARE ENGINEER\nI  am  a  Software  Engineering  student  at  Comsats  University  Lahore,\nThroughout my degree, I have acquired proficiency in programming,\nobject-oriented programming (OOP), data structures, algorithms, and\ndatabases. My focus has been on building a solid foundation in these\nareas.\nProjects\nComsats University Lahore Campus\nPunjab Group of Colleged\nSoftware Engineering\nICS\n2020-present\n2018-2020\nHTML/CSS\nSQL\nNoSQL\nEnglish\nUrdu\nSkills\nLanguage\nJavaScript\nReact.Js\nNode.Js\nUser Authentication In Mern\nFeatures: User Sign Up , Sign up with google (oauth 20) , JWT\n(javascript web token) storing in the user's browser , User Sign In\nusing JWT , Showing dashboard on Sign In.\nE-Commerce website in MERN\nFeatures: Product  Listing,  Product  Details,Add  to  Cart,\nDelete from Cart, Update Cart, Persistent Cart Storage using\ncookie, Remove Items from Cart, Checkout:\nLearnify app in React native and Firebase\nStudent: Registration  ,  Login  ,  view  teachers  list  ,  make\nappointment , realtime chat , change profile , reset password\nTeacher:  Registration , Login , accept/remove hiring request\n, change profile info , reset password.\nGym Management System using Linked List in C\nFeatures: Member SignUp , Login , change password , change\nname , pay fee.\nAdmin  login  ,  see  all  members  ,  search  by  name  ,  delete\nmember , check fee status.\nRestaurant Management System Database (SQL Server)\nFeatures: Database Schema , Queries , Procedures , triggers\n,Views \nhttps://github.com/MuhammadAbdullah9999\nGithub\nSmart HRM\nDescription: HR and Payroll system with CV matching with Job\ndescription using ML model.\nGit\nGitHub\nExpress.Js"}, {'id': '65d0f94d203998b62f9be925', 'name': 'muhammad abdullah', 'phoneNumber': '3101404487', 'email': 'hafizzabdullahhjk@gmail.com', 'password': '$2b$10$ndY/2iEwpDfYDmbuzvNMmeP06L3IyqNmdzy9rwp3koFyf.LGwDI66', 'resume': "\n\nContact\nEducation\n+923101404487\nPhone\nhafizzabdullah999@gmail.com\nEmail\nwww.linkedin.com/in/hafiz-muhammad-\nabdullah-\nLinkedin\nMUHAMMAD ABDULLAH\nSOFTWARE ENGINEER\nI  am  a  Software  Engineering  student  at  Comsats  University  Lahore,\nThroughout my degree, I have acquired proficiency in programming,\nobject-oriented programming (OOP), data structures, algorithms, and\ndatabases. My focus has been on building a solid foundation in these\nareas.\nProjects\nComsats University Lahore Campus\nPunjab Group of Colleged\nSoftware Engineering\nICS\n2020-present\n2018-2020\nHTML/CSS\nSQL\nNoSQL\nEnglish\nUrdu\nSkills\nLanguage\nJavaScript\nReact.Js\nNode.Js\nUser Authentication In Mern\nFeatures: User Sign Up , Sign up with google (oauth 20) , JWT\n(javascript web token) storing in the user's browser , User Sign In\nusing JWT , Showing dashboard on Sign In.\nE-Commerce website in MERN\nFeatures: Product  Listing,  Product  Details,Add  to  Cart,\nDelete from Cart, Update Cart, Persistent Cart Storage using\ncookie, Remove Items from Cart, Checkout:\nLearnify app in React native and Firebase\nStudent: Registration  ,  Login  ,  view  teachers  list  ,  make\nappointment , realtime chat , change profile , reset password\nTeacher:  Registration , Login , accept/remove hiring request\n, change profile info , reset password.\nGym Management System using Linked List in C\nFeatures: Member SignUp , Login , change password , change\nname , pay fee.\nAdmin  login  ,  see  all  members  ,  search  by  name  ,  delete\nmember , check fee status.\nRestaurant Management System Database (SQL Server)\nFeatures: Database Schema , Queries , Procedures , triggers\n,Views \nhttps://github.com/MuhammadAbdullah9999\nGithub\nSmart HRM\nDescription: HR and Payroll system with CV matching with Job\ndescription using ML model.\nGit\nGitHub\nExpress.Js"}, {'id': '65d0f9867638bbff5252bc6d', 'name': 'muhammad abdullah', 'phoneNumber': '3101404487', 'email': 'hafizzabdullahh@gmail.com', 'password': '$2b$10$s93jRf5sv5PYXtqDFZG3G..cM845UeAQED3yPy9HIKezMG.BhdSzu', 'resume': "\n\nContact\nEducation\n+923101404487\nPhone\nhafizzabdullah999@gmail.com\nEmail\nwww.linkedin.com/in/hafiz-muhammad-\nabdullah-\nLinkedin\nMUHAMMAD ABDULLAH\nSOFTWARE ENGINEER\nI  am  a  Software  Engineering  student  at  Comsats  University  Lahore,\nThroughout my degree, I have acquired proficiency in programming,\nobject-oriented programming (OOP), data structures, algorithms, and\ndatabases. My focus has been on building a solid foundation in these\nareas.\nProjects\nComsats University Lahore Campus\nPunjab Group of Colleged\nSoftware Engineering\nICS\n2020-present\n2018-2020\nHTML/CSS\nSQL\nNoSQL\nEnglish\nUrdu\nSkills\nLanguage\nJavaScript\nReact.Js\nNode.Js\nUser Authentication In Mern\nFeatures: User Sign Up , Sign up with google (oauth 20) , JWT\n(javascript web token) storing in the user's browser , User Sign In\nusing JWT , Showing dashboard on Sign In.\nE-Commerce website in MERN\nFeatures: Product  Listing,  Product  Details,Add  to  Cart,\nDelete from Cart, Update Cart, Persistent Cart Storage using\ncookie, Remove Items from Cart, Checkout:\nLearnify app in React native and Firebase\nStudent: Registration  ,  Login  ,  view  teachers  list  ,  make\nappointment , realtime chat , change profile , reset password\nTeacher:  Registration , Login , accept/remove hiring request\n, change profile info , reset password.\nGym Management System using Linked List in C\nFeatures: Member SignUp , Login , change password , change\nname , pay fee.\nAdmin  login  ,  see  all  members  ,  search  by  name  ,  delete\nmember , check fee status.\nRestaurant Management System Database (SQL Server)\nFeatures: Database Schema , Queries , Procedures , triggers\n,Views \nhttps://github.com/MuhammadAbdullah9999\nGithub\nSmart HRM\nDescription: HR and Payroll system with CV matching with Job\ndescription using ML model.\nGit\nGitHub\nExpress.Js"}]



data = rank_applicants(job_description, applicants)
print(data)
