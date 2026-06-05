import math

from data.materials import SPRING_MATERIALS


def calculate_extension_spring(inputs):

    d = inputs.wire_diameter
    D = inputs.coil_diameter
    n = inputs.active_coils
    force = inputs.force
    initial_tension = inputs.initial_tension

    material_data = SPRING_MATERIALS[inputs.material]
    G = material_data["shear_modulus"]

    spring_rate = (G * d**4) / (8 * D**3 * n)
    outside_diameter = D + d
    inside_diameter = D - d
    spring_index = D / d

    working_extension = max((force - initial_tension) / spring_rate, 0)
    effective_force = initial_tension + spring_rate * working_extension

    wahl_factor = ((4 * spring_index - 1) / (4 * spring_index - 4)) + (0.615 / spring_index)
    stress = (
        (8 * effective_force * D) /
        (math.pi * d**3)
    ) * wahl_factor

    graph_data = []

    for extension in range(0, 11):
        graph_force = initial_tension + spring_rate * extension

        graph_data.append({
            "deflection": extension,
            "force": graph_force
        })

    return {
        "spring_type": "extension",
        "spring_rate": spring_rate,
        "outside_diameter": outside_diameter,
        "inside_diameter": inside_diameter,
        "spring_index": spring_index,
        "initial_tension": initial_tension,
        "extension": working_extension,
        "stress": stress,
        "graph_data": graph_data
    }
