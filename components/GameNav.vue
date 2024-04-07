<template>
    <ul
        class="list-none m-0 p-0 flex flex-row lg:flex-column justify-content-evenly md:justify-content-between lg:justify-content-start mb-5 lg:pr-8 lg:mb-0">
        <template v-for="item in navigation" :key="item.name">
            <li
                v-if="!item.condition || (item.condition && currentUser.props && currentUser.props[item.condition] == true)">
                <NuxtLink :to="item.href" v-ripple
                    :class="[route.path == item.href ? 'bg-ground text-primary hover:bg-primary-reverse hover:text-primary' : 'text-color-secondary hover:bg-primary-reverse hover:text-color', 'flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple']"
                    :aria-current="route.path == item.href ? 'page' : undefined">
                    <i aria-hidden="true"
                        :class="[route.path == item.href ? 'text-primary group-hover:text-primary' : 'text-color-secondary group-hover:text-color', item.icon, 'md:mr-2']" />
                    <span class="font-medium hidden md:block">{{ item.name }}</span>
                </NuxtLink>
            </li>
        </template>
        <li>
            <hr class="mb-2 border-50" />
            <NuxtLink :to="`/game`" class="no-underline mr-2">
                <Button severity="primary" title="Back to Games" alt="Back" text><i class="pi pi-arrow-left mr-1"></i>
                    Back
                    to
                    Games</Button>
            </NuxtLink>
        </li>
        <li class="mt-2">
            <Button @click="game.delete()" severity="danger" title="Delete" alt="Delete Game"><i
                    class="pi pi-trash mr-1"></i>
                Delete</Button>
        </li>



    </ul>
</template>

<script setup>
const route = useRoute();
const currentUser = useCurrentUserStore();
const props = defineProps({
    game: Object,
});

const navigation = [
    { name: 'Settings', href: `/game/${props.game.props?.id}`, icon: 'pi pi-user' },
    { name: 'Designs', href: `/game/${props.game.props?.id}/designs`, icon: 'pi pi-key' },
    { name: 'Datasets', href: `/game/${props.game.props?.id}/datasets`, icon: 'pi pi-sliders-h' },
    { name: 'Font Pallet', href: `/game/${props.game.props?.id}/fontpallet`, icon: 'pi pi-unlock' },
    { name: 'Archives', href: `/game/${props.game.props?.id}/archives`, icon: 'pi pi-unlock' },
    { name: 'Exports', href: `/game/${props.game.props?.id}/exports`, icon: 'pi pi-unlock' },
    { name: 'Collaborators', href: `/game/${props.game.props?.id}/collaborators`, icon: 'pi pi-users' },
]
</script>