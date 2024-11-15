from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

# Initialize FastAPI app
app = FastAPI()

# Load BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Pydantic model for request body
class MatchRequest(BaseModel):
    user_skills: str
    job_descriptions: list[str]

# Function to get embeddings
def get_bert_embeddings(text):
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1)

# API endpoint to match jobs
@app.post("/match-jobs")
async def match_jobs(request: MatchRequest):
    # Get embedding for user skills
    user_skills_embedding = get_bert_embeddings(request.user_skills)
    
    # Get embeddings for each job description
    job_embeddings = [get_bert_embeddings(job) for job in request.job_descriptions]
    
    # Calculate cosine similarity
    similarities = [cosine_similarity(user_skills_embedding, job_embedding).item() for job_embedding in job_embeddings]
    
    # Find the best match
    most_similar_job_index = similarities.index(max(similarities))
    best_match = request.job_descriptions[most_similar_job_index]
    
    # Return best match as JSON response
    return {"best_match": best_match, "similarity_score": max(similarities)}
