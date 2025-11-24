
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



    let cb_arr: Action[] = [null, null, null, null, null, null, null, null];
    let button_firstflag = false;
    let flag = false;
    let btn_scantime_value = 2;
    let btn_Scantime: number[] = [btn_scantime_value, btn_scantime_value, btn_scantime_value, btn_scantime_value];


    export enum ButtonBt {
        P_12,
        P_13,
        P_14,
        P_15,
        button_num
    }

    //创建一个数组，把JoystickBitPin枚举中所有的pin放进去
    let ButtonPinArr: number[] = [DAL.MICROBIT_ID_IO_P12, DAL.MICROBIT_ID_IO_P13, DAL.MICROBIT_ID_IO_P14, DAL.MICROBIT_ID_IO_P15];



    /**
    * Registers code to run when a joystick:bit event is detected.
    */
    //% blockId=onButtonEvent block="on button %button|is %event" blockExternalInputs=false
    export function onButtonEvent(button: JoystickBitPin, event: ButtonType, handler: Action): void {

        //这里的index为函数事件下标，我的event只有按下和未按下状态，所以button处乘以2，此时cb_arr数组会注册进去进入onbuttonevent函数的参数的按键和事件，cb_arr的对应位就被赋值(注册)了
        let index = 0;
        switch (button) {
            case JoystickBitPin.P12:
                if (event == ButtonType.up) {
                    index = 0 * 2 + 0;
                }
                else {
                    index = 0 * 2 + 1;
                }
                break;
            case JoystickBitPin.P13:
                if (event == ButtonType.up) {
                    index = 1 * 2 + 0;
                }
                else {
                    index = 1 * 2 + 1;
                }
                break;
            case JoystickBitPin.P14:
                if (event == ButtonType.up) {
                    index = 2 * 2 + 0;
                }
                else {
                    index = 2 * 2 + 1;
                }
                break;
            case JoystickBitPin.P15:
                if (event == ButtonType.up) {
                    index = 3 * 2 + 0;
                }
                else {
                    index = 3 * 2 + 1;
                }
                break;
        }
        // let index = (button * 2 + event);/

        cb_arr[index] = handler;
        if (!button_firstflag) {
            button_firstflag = true;
            control.inBackground(function () {
                while (true) {

                    //1. 判断所有按键状态，是否是按下

                    // 后台处理按键状态更新 1. 获取已注册的按键状态 2. 定时扫描按键状态变化 3. 触发事件处理程序

                    //循环判断按键是否按下--已按下则根据是否注册 决定是否触发callback 2. 触发事件处理程序
                    for (let i = 0; i < ButtonBt.button_num - 1; i++) {//判断是否按下，共4个按键0~3,循环中轮询判断按键状态，按下：使得按键计次(btn_Scantime)-1 跳出，下次进入则计次再-1，直到计次==0，则执行回调  else(没按)：跳出
                        // if (cb_arr[1] != null) {

                        //判断按键是否按下
                        if (getButton(ButtonPinArr[i])) {
                            if (!(--btn_Scantime[i])) {
                                if (cb_arr[i * 2 + 1] != null) {
                                    control.inBackground(function () {
                                        cb_arr[i * 2 + 1]();
                                        btn_Scantime[i] = btn_scantime_value;
                                    })
                                }
                                control.inBackground(function () {
                                    //松开
                                    while (getButton(ButtonPinArr[i])) {
                                    }
                                    if (cb_arr[i * 2 + 0] != null) {
                                        {
                                            cb_arr[i * 2 + 0]();
                                        }
                                        return;
                                    }
                                })

                            } else {
                                btn_Scantime[i] = btn_scantime_value;
                            }

                        }
                        basic.pause(10);
                    }
                }
            })
        }


        //     let state = getButton(button);
        //     basic.pause(25);
        //     if (state != getButton(button)) {
        //         return;
        //     } else {
        //         pins.onPulsed(<number>button, <number>event, handler);
        //     }
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

