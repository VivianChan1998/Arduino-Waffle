from flask import Flask, request, jsonify
from flask_cors import CORS
from Enums import ComponentType
from Components.Stepper import Stepper
from Components.Button import Button
from Components.LED import LED
from Components.Potentiometer import Potentiometer
from Components.UltrasonicSensor import UltrasonicSensor
from Board import Board
from IOBehavior import IOBehavior

input_options = ["button", "stepper"]
output_options = ["stepper", "LED"]

#included_input_behavior = [IOBehavior(UltrasonicSensor(1, Uno))]
#included_output = [led_component, led_component2]

app = Flask(__name__)
CORS(app)

@app.route("/list_components")
def list_components():
    inputs_str = ','.join(input_options)
    outputs_str = ','.join(output_options)
    return '{"input":"' + inputs_str + '","output":"' + outputs_str + '"}'

@app.route("/chosen_components", methods=['POST'])
def chosen_components():
    print(request)
    data = request.get_json(force=True)
    print(data)
    
    return '{"status": "ok"}'