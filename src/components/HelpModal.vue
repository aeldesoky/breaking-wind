<template>
	<div class="modal-backdrop">
		<div class="modal">
			<header class="modal-header">
				<slot name="header">
					General Options Help
				</slot>
			</header>
			<section class="modal-body">
				<slot name="body">
					Here is a description of each option.
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

<script>
    export default {
        name: 'modal',

        methods: {
            close() {
                this.$emit('close');
            },
        },
    };
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
		color: #4AAE9B;
		justify-content: space-between;
	}

	.modal-footer {
		border-top: 1px solid #eeeeee;
		justify-content: flex-end;
	}

	.modal-body {
		position: relative;
		padding: 20px 10px;
	}
</style>