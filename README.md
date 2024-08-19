# Arduino Code Generator!



## TODOs
> most todos are commented in the  `main.py`!
> here we mark it with priority

- [ ] (medium) establish component instances based on user input
- [x] (high) initate Board component and assign pins to components
    > vivian is working on this one now!
    - [ ] Board.py, initiate board by reading from a file (?)
    - [ ] Board.py > register_one_pin(), choose available pin - depends on how the pin structure is established
- [ ] (low) function returned object is a string which might have multiple lines of code, need to modify them to ensure each entry in `code[]` is one line of code
- [ ] (low) fix code indentg
    > will look into this
- [ ] (high) add components!
    > xiaorui working on adding the ultrasonic sensor

## TODOs meeting aug 12
- [x] (xiaorui) IRB extension (?) or new IRB
- [x] (vivian) Behavior pair multiple i to multiple o
    - [ ] modify components to match
    - [ ] "init" questions 
- [x] (xiaorui vivian) potentiometer
- [x] task description for rough draft
    - [x] create new overleaf
    - [ ] write abstract of paper
- [ ] start on frontend


## Not too urgent
- [ ] fix led helper function 
- [ ] acquire components for testing (!!)