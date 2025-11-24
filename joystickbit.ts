
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */




//% weight=0 color=#0fbc11  icon="\uf11b" block="Joystickbit"
namespace joystickbit {



    export enum JoystickBitPin {
        //% block="C"
        P12 = DAL.MICROBIT_ID_IO_P12,
        //% block="D"
        P13 = DAL.MICROBIT_ID_IO_P13,
        //% block="E"
        P14 = DAL.MICROBIT_ID_IO_P14,
        //% block="F"
        P15 = DAL.MICROBIT_ID_IO_P15
    }

    export enum rockerType {
        //% block="X"
        X,
        //% block="Y"
        Y
    }


    export enum ButtonType {
        //% block="pressed"
        down = PulseValue.High,
        //% block="released"
        up = PulseValue.Low
    }

    /**
    * initialization joystick:bit
    */
    //% blockId=initJoystickBit block="initialization joystick:bit"
    export function initJoystickBit(): void {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    /**
    * get Button
    */
    //% blockId=getButton block="button %button is pressed"
    export function getButton(button: JoystickBitPin): boolean {
        return (pins.digitalReadPin(<number>button) == 0 ? true : false)
    }
    let button_firstflag = false;
    let btn_status_arr = [0, 0, 0, 0];
    export enum ButtonBt {
        P_12,
        P_13,
        P_14,
        P_15,
        button_num
    }



    const ButtonPinArr: number[] = [DAL.MICROBIT_ID_IO_P12, DAL.MICROBIT_ID_IO_P13, DAL.MICROBIT_ID_IO_P14, DAL.MICROBIT_ID_IO_P15];
    const ButtonPinsourceArr: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    /**
    * Registers code to run when a joystick:bit event is detected.
    */
    //% blockId=onButtonEvent block="on button %button|is %event" blockExternalInputs=false
    export function onButtonEvent(button: JoystickBitPin, event: ButtonType, handler: Action): void {
        const arr_btn = [JoystickBitPin.P12, JoystickBitPin.P13, JoystickBitPin.P14, JoystickBitPin.P15];

        for (let i = 0; i < 4; i++) {
            if (arr_btn[i] == button) {
                let index_ = i * 2 + (event == ButtonType.down ? 0 : 1);
                ButtonPinsourceArr[index_] = index_ + 0x9F;
                control.onEvent(ButtonPinsourceArr[index_], ButtonPinsourceArr[index_], handler);
                break;

            }
        }

        if (!button_firstflag) {
            button_firstflag = true;
            control.inBackground(function () {
                while (true) {

                    for (let i = 0; i < ButtonBt.button_num; i++) {
                        let ret = getButton(ButtonPinArr[i]);
                        if (ret) {
                            if (btn_status_arr[i] != 3) {
                                btn_status_arr[i]++;
                                if (btn_status_arr[i] == 3) {
                                    let event = i * 2 + 0 + 0x9F;
                                    control.raiseEvent(event, event);
                                }
                            }
                        } else {
                            if (btn_status_arr[i] == 3) {
                                let event = i * 2 + 1 + 0x9F;
                                control.raiseEvent(event, event);
                            }
                            btn_status_arr[i] = 0;
                        }
                    }
                    basic.pause(10);
                }
            })
        }
    }




    /**
    * Reads rocker value for the defined axis.
    * @param rocker rocker axis to read
    */
    //% blockId=getRockerValue block="rocker value of %rocker"
    export function getRockerValue(rocker: rockerType): number {
        switch (rocker) {
            case rockerType.X: return pins.analogReadPin(AnalogPin.P1);
            case rockerType.Y: return pins.analogReadPin(AnalogPin.P2);
            default: return 0;
        }
    }




    /**
    * vibration motor
    * @param time describe parameter here, eg: 100
    */
    //% blockId=Vibration_Motor block="motor vibrate for %time ms"
    export function Vibration_Motor(time: number): void {
        pins.digitalWritePin(DigitalPin.P16, 0)
        basic.pause(time)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }










}

