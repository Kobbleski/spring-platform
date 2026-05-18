import math


def calculate_compression_spring(inputs):

    d = inputs.wire_diameter
    D = inputs.coil_diameter
    n = inputs.active_coils
    G = inputs.shear_modulus

    # Spring rate
    spring_rate = (G * d**4) / (8 * D**3 * n)

    # Diameters
    outside_diameter = D + d
    inside_diameter = D - d

    # Spring index
    spring_index = D / d

    # Solid height
    solid_height = n * d

    # Example force
    force = 10

    # Wahl correction factor
    wahl_factor = ((4 * spring_index - 1) / (4 * spring_index - 4)) + (0.615 / spring_index)

    # Stress
    stress = (
        (8 * force * D) /
        (math.pi * d**3)
    ) * wahl_factor

    return {
        "spring_rate": spring_rate,
        "outside_diameter": outside_diameter,
        "inside_diameter": inside_diameter,
        "spring_index": spring_index,
        "solid_height": solid_height,
        "stress": stress
    }