# from flask import Flask, request, jsonify
# from CV_Matching import rank_applicants

# app = Flask(__name__)
# job_description="i need a programming , OOP , data structures and database person"

# @app.route('/api', methods=['POST'])
# def handle_post_request():
#     if request.is_json:
#         data = request.get_json()
#         # return(data['applicants'])
#         ranking=rank_applicants(job_description,data['applicants'])
#         # print(ranking)
#         return(ranking)


# if __name__ == '__main__':
#     app.run(port=5001)
from flask import Flask, request, jsonify
from CV_Matching import rank_applicants
# from CV_Matching_Using_HuggingFace import rank_applicants
app = Flask(__name__)

@app.route('/api', methods=['POST'])
def handle_post_request():
    try:
        if request.is_json:
            data = request.get_json()

            applicants = data.get('applicants', [])
            job_description = data.get('job_description', '')  # Updated key name to 'job_description'

            if isinstance(applicants, list) and all(isinstance(applicant, dict) for applicant in applicants) and isinstance(job_description, str):
                ranking = rank_applicants(job_description, applicants)

                print(ranking)
                return jsonify({'ranking': ranking})
            else:
                return jsonify({'error': 'Invalid format in the request body'})
        else:
            return jsonify({'error': 'Invalid JSON in the request'})
    except Exception as e:
        return jsonify({'error': f'Internal Server Error: {str(e)}'})

if __name__ == '__main__':
    app.run(port=5001)
