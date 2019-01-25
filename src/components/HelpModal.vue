<!--
Help modal for the Parameters panel.

Used to provide more information to the user regarding the general options.
-->

<template>
	<div class="modal-backdrop">
		<div class="modal">
			<header class="modal-header">
				<slot name="header">
					Parameter Information
				</slot>
			</header>
			<section class="modal-body">
				<slot name="body">
					<div
					v-for="(parameter, i) in parameters"
					:key="parameter.title"
					>
						<h4>{{ parameter.title }}</h4>
						<span>{{ parameter.description }}</span>
						<v-divider v-if="i !== parameters.length - 1"></v-divider>
					</div>
				</slot>
			</section>
			<footer class="modal-footer">
				<slot name="footer">
					<button
						type="button"
						@click="close"
					>
						Close
					</button>
				</slot>
			</footer>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

export type Parameters = Array<{ title: string, description: string }>;

@Component({
  components: {
    HelpModal,
  },
})
export default class HelpModal extends Vue {
  @Prop({ type: Array, required: true }) parameters!: Parameters;
  public close() {
    this.$emit('close');
  }
}
</script>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		color: black;
	}

	.modal {
		background: #FFFFFF;
		box-shadow: 2px 2px 20px 1px;
		overflow-x: auto;
		display: flex;
		flex-direction: column;
	}

	.modal-header,
	.modal-footer {
		padding: 15px;
		display: flex;
	}

	.modal-header {
		border-bottom: 1px solid #eeeeee;
		color: #1976d2;
		justify-content: space-between;
	}

	.modal-footer {
		border-top: 1px solid #eeeeee;
		justify-content: flex-end;
	}

	.modal-body {
		position: relative;
		padding: 20px 10px;
		width: 50vw;
	}
</style>