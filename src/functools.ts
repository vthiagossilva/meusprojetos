
export function toCashBR(value: number, likeArray?: boolean) {
    const values = value.toString().split('.');
    const currency = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const cents = values.length === 2 ? (values[1].length === 1 ? values[1] + '0' : values[1]) : '00';
    if (!likeArray) {
        return `R$ ${currency},${cents}`;
    }
    return [currency, cents];
}

export function convertDate(date: Date, type: 'date' | 'hour', seconds?: boolean, normated?: boolean) {
    if (type === 'date') {
        const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
        const year = date.getFullYear().toString();
        if (normated) {
            return `${year}-${month}-${day}`;
        }
        return `${day}/${month}/${year}`;
    } else {
        const hour = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
        if (seconds) {
            const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
            return `${hour}:${minutes}:${seconds}`;
        }
        return `${hour}:${minutes}`;
    }
}

export function welcome(): string {
    const hour = (new Date()).getHours();
    return (hour >= 5 && hour < 12) ? 'Bom dia' : (hour >= 12 && hour < 18 ? 'Boa tarde' : 'Boa noite');
}

export function toCapitalize(name: string) {
    return name[0].toUpperCase() + name.toLowerCase().slice(1);
}

export function generateUUID() {
    let d = new Date().getTime();//Timestamp
    let d2 = 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

