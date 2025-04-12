import streamlit as st
import pandas as pd
import sqlite3
import re
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage  # Import HumanMessage

# Set up page configuration for a better layout
st.set_page_config(
    page_title="Data Scientist Assistant",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize the LLM
llm = ChatGroq(
    temperature=0,
    groq_api_key='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',
    model_name="llama-3.3-70b-versatile"
)

# Sidebar for user input and instructions
st.sidebar.title("Data Scientist Assistant")
st.sidebar.write("Enter your question about the music track dataset below. The tool will generate an SQL query and interpret the results.")

user_prompt = st.sidebar.text_input("Your Question:")

st.title("SQL Query Generation for Music Track Data")
st.markdown("### Dataset Overview")
st.write("The dataset contains music track data with key columns including:")
st.markdown("""
- **track_id:** Unique track identifier  
- **artists:** Name(s) of the artist(s)  
- **album_name:** Album name  
- **track_name:** Track title  
- **popularity:** Numerical measure of track popularity  
- **duration_ms:** Duration in milliseconds  
- **explicit:** Boolean flag indicating explicit content  
- **danceability, energy, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo:** Various audio features  
- **key:** Musical key (numeric)  
- **mode:** Mode (0 for minor, 1 for major)  
- **time_signature:** Time signature  
- **track_genre:** Genre of the track  
""")

# Load the dataset using caching for performance
@st.cache_data
def load_data():
    df = pd.read_csv("dataset_preprocessed.csv")
    return df

df = load_data()

# Create an in-memory SQLite database and load the dataframe into a table named "tracks"
conn = sqlite3.connect(":memory:")
df.to_sql("tracks", conn, if_exists='replace', index=False)

def extract_sql_query(text):
    """
    Extracts the SQL query from text that contains a SQL code block marked by triple backticks.
    If no code block is found, returns the original text.
    """
    start_marker = "```sql"
    end_marker = "```"
    start_index = text.find(start_marker)
    if start_index != -1:
        start_index += len(start_marker)
        end_index = text.find(end_marker, start_index)
        if end_index != -1:
            return text[start_index:end_index].strip()
    return text.strip()

if user_prompt:
    # Check for keywords or digits that imply sorting, and add an instruction to use track_id as tie-breaker.
    order_instruction = ""
    if (any(keyword in user_prompt.lower() for keyword in ["lowest", "highest", "top", "bottom"]) 
        or re.search(r'\b\d+\b', user_prompt)):
        order_instruction = ("Note: If there are ties (e.g., multiple songs with the same popularity), "
                             "order the results by track_id in ascending order.")

    # Construct the prompt for SQL generation
    prompt = f"""
You are a data scientist. You have access to a dataset stored in a SQLite table called "tracks" with the following columns:
- track_id: unique track identifier
- artists: artist names
- album_name: album name of the track
- track_name: track title
- popularity: numerical measure of track popularity
- duration_ms: duration in milliseconds
- explicit: boolean indicating explicit content
- danceability: score indicating how danceable a track is
- energy: energy level of the track
- key: musical key (numerical)
- loudness: loudness in decibels
- mode: musical mode (0 for minor, 1 for major)
- speechiness: measure of spoken words in a track
- acousticness: score indicating how acoustic the track is
- instrumentalness: measure indicating if a track is instrumental
- liveness: measure of live audience presence
- valence: measure of musical positiveness
- tempo: tempo in beats per minute
- time_signature: time signature
- track_genre: genre of the track

{order_instruction}

Based on the following user question, generate an SQL query that can be executed against the "tracks" table.
User Question: "{user_prompt}"
SQL Query:
"""
    st.markdown("## Generating SQL Query...")
    with st.spinner("Generating SQL query..."):
        response = llm.invoke([HumanMessage(content=prompt)])
    response_text = response.content
    sql_query = extract_sql_query(response_text)
    
    st.markdown("### Generated SQL Query")
    st.code(sql_query, language="sql")
    
    # Execute the SQL query and display the result
    try:
        result_df = pd.read_sql(sql_query, conn)
        st.markdown("## Query Result")
        st.dataframe(result_df)
        
        # Prepare prompt for answer generation
        if not result_df.empty:
            table_str = result_df.to_csv(index=False)
            answer_prompt = f"""
You are a data scientist. The user asked: "{user_prompt}".
The SQL query executed on the dataset returned the following table:

{table_str}

Based on this table and the original question, explain the results in plain language.
"""
        else:
            answer_prompt = f"""
You are a data scientist. The user asked: "{user_prompt}".
The SQL query executed on the dataset returned no records.
Explain in plain language what this might mean.
"""
        
        st.markdown("## Generating Answer...")
        with st.spinner("Generating answer..."):
            response_answer = llm.invoke([HumanMessage(content=answer_prompt)])
        answer = response_answer.content
        
        st.markdown("### Answer")
        st.markdown(answer)
        
    except Exception as e:
        st.error(f"Error executing the query: {e}")
else:
    st.info("Please enter a question about the dataset in the sidebar.")
