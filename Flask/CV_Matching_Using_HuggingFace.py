from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0]  # First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    return sum_embeddings / sum_mask

def rank_applicants(job_description, applicants):
    # Load pre-trained model
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-mpnet-base-v2')
    model = AutoModel.from_pretrained('sentence-transformers/all-mpnet-base-v2')

    # Tokenize job description
    encoded_job_description = tokenizer(job_description, padding=True, truncation=True, return_tensors='pt')

    # Compute token embeddings for job description
    with torch.no_grad():
        job_description_output = model(**encoded_job_description)

    # Perform pooling for job description
    job_description_embedding = mean_pooling(job_description_output, encoded_job_description['attention_mask'])
    job_description_embedding = F.normalize(job_description_embedding, p=2, dim=1)

    # Tokenize and compute embeddings for resumes
    resume_texts = [applicant.get("resume", "") for applicant in applicants]
    encoded_resumes = tokenizer(resume_texts, padding=True, truncation=True, return_tensors='pt')

    with torch.no_grad():
        resumes_output = model(**encoded_resumes)

    # Perform pooling for resumes
    resume_embeddings = mean_pooling(resumes_output, encoded_resumes['attention_mask'])
    resume_embeddings = F.normalize(resume_embeddings, p=2, dim=1)

    # Calculate cosine similarity between job description and resumes
    cosine_similarities = cosine_similarity(job_description_embedding.cpu().numpy(), resume_embeddings.cpu().numpy())
    ranking = list(enumerate(cosine_similarities.flatten(), start=1))
    ranking.sort(key=lambda x: x[1], reverse=True)

    # Assign rankings to each applicant
    for i, (resume_index, similarity) in enumerate(ranking, start=1):
        applicants[resume_index - 1]["ranking"] = i
        applicants[resume_index - 1]["similarity"] = similarity  # Adding similarity score for more insight

    # Sort the applicants based on ranking
    sorted_applicants = sorted(applicants, key=lambda x: x.get("ranking", float('inf')))

    # Return the top 10 ranked applicants
    top_10_applicants = sorted_applicants[:10]

    return top_10_applicants

