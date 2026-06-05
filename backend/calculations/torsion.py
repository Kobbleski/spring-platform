import math

from data.materials import SPRING_MATERIALS


def _torsion_stress_correction(spring_index):

    return (
        (4 * spring_index**2 - spring_index - 1) /
        (4 * spring_index * (spring_index - 1))
    )


def _base_geometry(inputs):

    d = inputs.wire_diameter
    D = inputs.coil_diameter

    return {
        "outside_diameter": D + d,
        "inside_diameter": D - d,
        "spring_index": D / d,
    }


def calculate_round_wire_torsion_spring(inputs):

    d = inputs.wire_diameter
    D = inputs.coil_diameter
    n = inputs.active_coils
    angle = inputs.angle_degrees

    material_data = SPRING_MATERIALS[inputs.material]
    E = material_data["elastic_modulus"]

    torque_rate = (E * d**4) / (10.8 * D * n * 360)
    torque = torque_rate * angle

    spring_index = D / d
    correction_factor = _torsion_stress_correction(spring_index)
    bending_stress = correction_factor * ((32 * torque) / (math.pi * d**3))

    graph_data = []

    for graph_angle in range(0, 181, 18):
        graph_data.append({
            "deflection": graph_angle,
            "force": torque_rate * graph_angle
        })

    return {
        "spring_type": "round_torsion",
        "torque_rate": torque_rate,
        "torque": torque,
        **_base_geometry(inputs),
        "bending_stress": bending_stress,
        "graph_data": graph_data
    }


def calculate_square_section_torsion_spring(inputs):

    side = inputs.wire_diameter
    D = inputs.coil_diameter
    n = inputs.active_coils
    angle = inputs.angle_degrees

    material_data = SPRING_MATERIALS[inputs.material]
    E = material_data["elastic_modulus"]

    # Approximation for square-section torsion springs: use the round-wire
    # torsion-rate form with a section stiffness factor for square bar stock.
    square_section_factor = 64 / (12 * math.pi)
    torque_rate = (E * side**4 * square_section_factor) / (10.8 * D * n * 360)
    torque = torque_rate * angle

    spring_index = D / side
    correction_factor = _torsion_stress_correction(spring_index)
    bending_stress = correction_factor * ((6 * torque) / side**3)

    graph_data = []

    for graph_angle in range(0, 181, 18):
        graph_data.append({
            "deflection": graph_angle,
            "force": torque_rate * graph_angle
        })

    return {
        "spring_type": "square_torsion",
        "torque_rate": torque_rate,
        "torque": torque,
        **_base_geometry(inputs),
        "bending_stress": bending_stress,
        "graph_data": graph_data
    }
