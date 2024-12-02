from flask import Flask, render_template, request, redirect, url_for, session
from questions import Quiz, Question

app = Flask(__name__)
app.secret_key = 'test_environment'

quiz = Quiz()

# Hypothetical the user has selected ultrasonic sensor + led (scuffed)
quiz.add_question(Question("What do you want to use your Ultrasonic Sensor for?", ['Binary threshold', 'Analog input']))
quiz.add_question(Question("What do you want your threshold to be?", ["10", "20", "30"]))
quiz.add_question(Question("What do you want to use your LED for?", ['Light up one color', 'Rainbow']))
quiz.add_question(Question("What color do you want to use?", ['Red', 'Blue', 'Orange']))

# Route to get available components
@app.route('/')
def index():
    session['current_question'] = 0
    return redirect(url_for('quiz_stage'))

@app.route('/quiz', methods=['GET', 'POST'])
def quiz_stage():
    if request.method == 'POST':
        selected_option = request.form.get('option')
        current_question_index = session.get('current_question')
        curr_question = quiz.questions[current_question_index]
        if selected_option is not None: 
            curr_question.update_answer(curr_question.options[int(selected_option)])
        session['current_question'] += 1
        if session['current_question'] >= len(quiz.questions):
            return redirect(url_for('results'))
        
    current_question_index = session.get('current_question')
    question = quiz.questions[current_question_index]
    return render_template('quiz.html', question=question, question_index=current_question_index + 1, total_questions=len(quiz.questions))

@app.route('/results')
def results():
    score = session.get('score')
    total_questions = len(quiz.questions)
    print([x.answer for x in quiz.questions])
    answers = [x.answer for x in quiz.questions]
    return f"<h1> Program specifications: </h1> <h2>{answers}</h2>"

if __name__ == '__main__':
    app.run(debug=True)
