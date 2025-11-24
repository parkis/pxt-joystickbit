
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */




//% weight=0 color=#0fbc11  icon="\uf11b" block="Joystickbit"
namespace joystickbit {

    let button_firstflag = 0;

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

    let flag = false;
    const BTN_COUNT = 4;
    const DEBOUNCE_TIME = 20; // ms
    const SCAN_INTERVAL = 10; // ms
    let debounce_counter: number[] = [0, 0, 0, 0]; // 消抖计时器
    let pressed_state: boolean[] = [false, false, false, false]; // 是否已触发（防重复）


    let cb_arr: Action[] = [null, null, null, null, null, null, null, null];

    let btn_scantime_value = 20;
    let btn_Scantime: number[] = [btn_scantime_value, btn_scantime_value, btn_scantime_value, btn_scantime_value];

    const BUTTON_PINS: JoystickBitPin[] = [
        JoystickBitPin.P12,
        JoystickBitPin.P13,
        JoystickBitPin.P14,
        JoystickBitPin.P15
    ];

    /**
    * Registers code to run when a joystick:bit event is detected.
    */
    //% blockId=onButtonEvent block="on button %button|is %event" blockExternalInputs=false
    export function onButtonEvent(button: JoystickBitPin, event: ButtonType, handler: Action): void {

        if (event !== ButtonType.down) {
            return;
        }
        let btnIndex = -1;
        for (let i = 0; i < BTN_COUNT; i++) {
            if (BUTTON_PINS[i] === button) {
                btnIndex = i;
                break;
            }
        }
        if (btnIndex === -1) return;

        // 注册回调
        cb_arr[btnIndex] = handler;


        // let index = (button * 4 + event)
        // cb_arr[index] = handler;
        if (!flag) {
            flag = true;
            control.inBackground(function () {
                // 后台处理按键状态更新 1. 获取已注册的按键状态 2. 定时扫描按键状态变化 3. 触发事件处理程序
                // while(true){

                // }
                //循环判断按键是否按下--已按下则根据是否注册 决定是否触发callback 2. 触发事件处理程序
                for (let i = 0; i < BTN_COUNT; i++) {//判断是否按下，共4个按键0~3,循环中轮询判断按键状态，按下：使得按键计次(btn_Scantime)-1 跳出，下次进入则计次再-1，直到计次==0，则执行回调  else(没按)：跳出
                    // if (cb_arr[1] != null) {
                    let isPressed = getButton(BUTTON_PINS[i]); // true = 按下


                    if (isPressed) {
                        //消抖
                        if (debounce_counter[i] > 0) {
                            debounce_counter[i]--;
                            if (debounce_counter[i] === 0) {
                                //完成消抖，且仍然是按下状态
                                if (!pressed_state[i] && cb_arr[i]) {
                                    pressed_state[i] = true;
                                    cb_arr[i]();

                                }

                            }
                        } else if (!pressed_state[i]) {
                            debounce_counter[i] = DEBOUNCE_TIME / SCAN_INTERVAL;
                        }
                    } else {
                        //按键已释放(未按下)，重置状态
                        pressed_state[i] = false;
                        debounce_counter[i] = 0;

                    }
                    //判断按键是否按下
                    // if (getButton(JoystickBitPin.P12+i)) {
                    //     if (--btn_Scantime[i]) {
                    //         pins.onPulsed(<number>button, <number>event, handler);
                    //         btn_Scantime[i] = btn_scantime_value;
                    //     }else{
                    //         btn_Scantime[i] = btn_scantime_value;
                    //     }

                    // }

                    // cb_arr[1]()
                    // }
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

