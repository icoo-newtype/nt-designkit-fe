<script setup lang="ts">
defineProps<{ variant?: Variant, size?: String }>()
</script>
<template>
  <button type="button" :class="[`btn-${variant ?? 'default'}`, `btn-${size ?? 'md'}`]" class="btn"><slot /></button>
</template>