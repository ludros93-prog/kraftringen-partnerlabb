"""Focused entrypoint for the current property-company intake workflow."""
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

spec = spec_from_file_location("property_intake_qa", Path(__file__).with_name("property-intake.py"))
module = module_from_spec(spec)
spec.loader.exec_module(module)
if __name__ == "__main__":
    module.main("service")
