class ModelSelectState
{
    prevModelId = $state("");
    filterName = $state("");
    filterFree = $state(false);
}

const state = new ModelSelectState();
export default state;