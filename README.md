# Arduino Code Generator!



## TODOs
> most todos are commented in the  `main.py`!
> here we mark it with priority

- [ ] (medium) establish component instances based on user input
- [x] (high) initate Board component and assign pins to components
    > vivian is working on this one now!
    - [ ] Board.py, initiate board by reading from a file (?)
    - [ ] Board.py > register_one_pin(), choose available pin - depends on how the pin structure is established
- [ ] (medium) I realized that i forgot to add Question "how many leds" in LED.py
- [ ] (low) function returned object is a string which might have multiple lines of code, need to modify them to ensure each entry in `code[]` is one line of code
- [ ] (low) fix code indent
- [ ] (high) add components!