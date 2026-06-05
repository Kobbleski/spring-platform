from fastapi import APIRouter

from calculations.extension import calculate_extension_spring
from models.spring_inputs import ExtensionSpringInput
from models.spring_outputs import ExtensionSpringOutput

router = APIRouter()


@router.post(
    "/calculate",
    response_model=ExtensionSpringOutput
)
def calculate(inputs: ExtensionSpringInput):

    result = calculate_extension_spring(inputs)

    return result
