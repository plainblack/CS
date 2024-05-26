<template>
    <Button type="button" severity="secondary" class="p-button-sm p-1" @mouseDown="toggle"><Icon name="gravity-ui:gear" /> <span v-if="toolbarLabels" class="ml-1 hidden md:block white-space-nowrap">Preferences</span></Button>

    <OverlayPanel ref="op" class="surface-ground">
        <div class="flex flex-wrap gap-4">
            <div class="flex-grow-1">
                <PanelZone title="Designer" margin="mb-0">

                    <div class="font-semibold text-medium">Layer Order</div>
                    <div class="mb-2"><small>Would you like layers to be built bottom-up like Photoshop or top down like code?</small></div>
                    <SelectButton v-model="layerOrder"  :options="[
                        {label: 'Top-Down', value: 'top-down'},
                        {label: 'Bottom-Up', value: 'bottom-up'},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />

                    <div class="mt-5 font-semibold text-medium">Layer Panel Width</div>
                    <div class="mb-2"><small>Only affects large displays.</small></div>
                    <SelectButton v-model="layerPanelWidth"  :options="[
                        {label: '10%', value: 'w-10rem'},
                        {label: '15%', value: 'w-15rem'},
                        {label: '20%', value: 'w-20rem'},
                        {label: '25%', value: 'w-25rem'},
                        {label: '35%', value: 'w-35rem'},
                        {label: '40%', value: 'w-40rem'},
                        {label: '50%', value: 'w-50rem'},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />

                    <div class="mt-5 font-semibold text-medium">Speed Mode</div>
                    <div class="mb-2"><small>Hide layers while recalculating for better performance.</small></div>
                    <SelectButton v-model="speedMode"  :options="[
                        {label: 'Fast', value: 'fast'},
                        {label: 'Elegance', value: 'elegance'},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />

                    <div class="mt-5 font-semibold text-medium">Refresh Mode</div>
                    <div class="mb-2"><small>Whether or not to refresh the design automatically after changes.</small></div>
                    <SelectButton v-model="refreshMode"  :options="[
                        {label: 'Automatic', value: 'auto'},
                        {label: 'Manual', value: 'manual'},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />

                    <div class="mt-5 font-semibold text-medium">Precache Images</div>
                    <div class="mb-2"><small>Whether or not to preload images into memory. Note that this can cause some side-effects based upon image size and internet speed.</small></div>
                    <SelectButton v-model="precacheImages"  :options="[
                        {label: 'Yes, Precache', value: true},
                        {label: 'Do Not Precache', value: false},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />

                </PanelZone>
            </div>
            <div class="flex-grow-1">
                <PanelZone title="Dataset">
                    <div class="font-semibold text-medium">Append New Rows</div>
                    <div class="mb-2"><small>To which end of the screen should new rows be added?</small></div>
                    <SelectButton v-model="appendNewRows"  :options="[
                        {label: 'Top', value: 'top'},
                        {label: 'Bottom', value: 'bottom'},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />
        
                </PanelZone>

                <PanelZone title="Global">
                    <div class="font-semibold text-medium">Toolbar Labels</div>
                    <div class="mb-2"><small>Should toolbar labels display text or only icons?</small></div>
                    <SelectButton v-model="toolbarLabels"  :options="[
                        {label: 'Text and Icons', value: true},
                        {label: 'Icons Only', value: false},
                        ]" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="basic" />
                        
                </PanelZone>
            </div>
        </div>

    </OverlayPanel>
</template>
<script setup>
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

// global
const toolbarLabels = useToolbarLabels();

// dataset
const appendNewRows = useAppendNewRows();

// designer
const layerOrder = useLayerOrder();
const speedMode = useSpeedMode();
const layerPanelWidth = useLayerPanelWidth();
const refreshMode = useRefreshMode();
const precacheImages = usePrecacheImages();

</script>