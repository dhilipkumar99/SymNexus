<svelte:head>
	<title>SymNexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="video-page">
	<video src="/video/SymNexusForYou.mp4" autoplay controls playsinline></video>
</div>

<style>
	:global(html, body) {
		overflow: hidden;
	}

	.video-page {
		position: fixed;
		inset: 0;
		z-index: 100;
		width: 100vw;
		height: 100vh;
		background: #000;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
