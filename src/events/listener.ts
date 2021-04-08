
export const expectEvent = (container: HTMLElement, event: string, eventInit: CustomEventInit<any>) => {
    const spy = jest.fn();
    container.addEventListener(event, spy);
    return { 
        event : () => container.dispatchEvent(new CustomEvent(event, eventInit)),
        call: spy
    }
}
