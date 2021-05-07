
function isCustomEvent(eventInit: any): eventInit is CustomEventInit<any> {
    return eventInit && eventInit.detail
}

export const expectEvent = (container: HTMLElement, event: string, eventInit: CustomEventInit<any> | any) => {
    const spy = jest.fn();
    container.addEventListener(event, spy);
    return { 
        event : () => container.dispatchEvent(isCustomEvent(eventInit) ? new CustomEvent(event, eventInit) : new CustomEvent(event, {detail: eventInit})),
        call: spy
    }
}
