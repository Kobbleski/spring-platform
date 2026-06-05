const NEWTONS_PER_LBF = 4.44822
const MM_PER_INCH = 25.4

export function inchesToMm(inches: number): number {

    return inches * MM_PER_INCH
}


export function mmToInches(mm: number): number {

    return mm / MM_PER_INCH
}


export function lbfToN(lbf: number): number {

    return lbf * NEWTONS_PER_LBF
}


export function nToLbf(newtons: number): number {

    return newtons / NEWTONS_PER_LBF
}


export function lbfInToNmm(torque: number): number {

    return torque * NEWTONS_PER_LBF * MM_PER_INCH
}


export function nmmToLbfIn(torque: number): number {

    return torque / (NEWTONS_PER_LBF * MM_PER_INCH)
}


export function nPerMmToLbfPerIn(value: number): number {

    return nToLbf(value) * MM_PER_INCH
}


export function mpaToKsi(value: number): number {

    return value * 0.145038
}
