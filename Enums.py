from enum import Enum


class PinType(Enum):
    POWER = 0
    DIGITAL = 1
    ANALOG = 2
    PWM = 3
    I2C_SDA = 4
    I2C_SCL = 5
    SERIAL_RX = 6
    SERIAL_TX = 7
    SPI_MISO = 8
    SPI_MOSI = 9
    SPI_SS = 10
    UNAVAILABLE = 99

class ComponentType(Enum):
    INPUT_DEVICE_DIGITAL = 0
    INPUT_DEVICE_ANALOG = 1
    INPUT_DEVICE_W_LIBRARY = 2
    OUTPUT_DEVICE_DIGITAL = 3
    OUTPUT_DEVICE_ANALOG = 4
    OUTPUT_DEVICE_W_LIBRARY = 5