const PinMode = Object.freeze({
    INPUT: 0,
    OUTPUT: 1
});

const PinType = Object.freeze({
    GND: 0,
    DIGITAL: 1,
    ANALOG: 2,
    PWM: 3,
    I2C_SDA: 4,
    I2C_SCL: 5,
    SERIAL_RX: 6,
    SERIAL_TX: 7,
    SPI_MISO: 8,
    SPI_MOSI: 9,
    SPI_SS: 10,
    VIN: 11,
    POWER_3V3: 12,
    POWER_5V: 13,
    UNAVAILABLE: 99
});

const ComponentType = Object.freeze({
    INPUT_DEVICE_ONLY_DIGITAL: 0,
    OUTPUT_DEVICE_ONLY_DIGITAL: 1,
    INPUT_DEVICE: 2,
    OUTPUT_DEVICE: 3
});

const AnswerType = Object.freeze({
    BOOL: 0,
    NUMERICAL: 1,
    MULTI_OPTION: 2,
    TEXT: 3
});

const STAGE = Object.freeze({
    CHOOSE_COMPONENT: 0,
    INIT_QUESTION: 1,
    IO_PAIRING: 2,
    DEFINE_BEHAVIOR: 3,
    RENDER_CODE: 4
});

export { PinMode, PinType, ComponentType, AnswerType, STAGE };
