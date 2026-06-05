from fastapi import APIRouter

from calculations.torsion import (
    calculate_round_wire_torsion_spring,
    calculate_square_section_torsion_spring,
)
from models.spring_inputs import (
    RoundWireTorsionSpringInput,
    SquareSectionTorsionSpringInput,
)
from models.spring_outputs import TorsionSpringOutput

router = APIRouter()


@router.post(
    "/round-wire/calculate",
    response_model=TorsionSpringOutput
)
def calculate_round_wire(inputs: RoundWireTorsionSpringInput):

    result = calculate_round_wire_torsion_spring(inputs)

    return result


@router.post(
    "/square-section/calculate",
    response_model=TorsionSpringOutput
)
def calculate_square_section(inputs: SquareSectionTorsionSpringInput):

    result = calculate_square_section_torsion_spring(inputs)

    return result
