export interface CompressionSpringInput {

    wire_diameter: number

    coil_diameter: number

    active_coils: number

    shear_modulus: number

    force: number

    material: string
}

export interface GraphPoint {
    deflection: number
    force: number
}

export interface CompressionSpringResult {

    spring_rate: number

    outside_diameter: number
    inside_diameter: number

    spring_index: number

    solid_height: number

    stress: number

    graph_data: GraphPoint[]
}

export async function calculateCompressionSpring(
    inputs: CompressionSpringInput
): Promise<CompressionSpringResult> {

    const response = await fetch(
        "http://127.0.0.1:8000/compression/calculate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputs)
        }
    )

    if (!response.ok) {
        throw new Error("Failed to calculate spring")
    }

    return response.json()
}