// object-fit: contain;
// width 100vw

class MyImageComp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false
		}
	}

	onLoadHandler() {
		this.setState({loaded: true});
	}

	render() {
		const style = {
			width: '100vw',
			objectFit: 'contain',
			transform: `translateY(${this.props.top}px)`,
			willChange: 'transform',
			opacity: this.state.loaded ? 1 : 0
		};

		return <img src={this.props.src} style={style} onLoad={this.onLoadHandler.bind(this)} />
	}
}

class MyPlaceholderComp extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const style = {
			width: '100vw',
			height: '100vw',
			objectFit: 'contain',
			transform: `translateY(${this.props.top}px)`,
			willChange: 'transform',
			backgroundColor: this.props.color
		};

		return <div style={style}></div>;
	}
}

class galleryComp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scrollY: window.scrollY
		};

		this.onScrollHandler = this.onScrollHandler.bind(this);
	}

	componentWillMount() {
		window.addEventListener('scroll', this.onScrollHandler);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScrollHandler);
	}

	onScrollHandler(e) {
		this.setState({
			scrollY: window.scrollY
		});
	}

    render() {
    	const style = {
			height: `calc(100vw * ${this.props.images.length})`,
			fontSize: 0
    	};

    	const topBase = Math.floor(window.scrollY / window.innerWidth) * window.innerWidth;

    	const infoStyle = {
    		width: '100px',
    		height: '50px',
    		position: 'fixed',
    		top: 0,
    		left: 0,
    		fontSize: '1rem',
    		background: 'rgba(255, 255, 255, 0.6)',
    		zIndex: 2
    	};

        return <div id="gallery" className="fast" style={style}>
        	<div style={infoStyle}>
        		<div>In page: {Math.ceil(window.innerHeight / window.innerWidth) + 1}</div>
        		page: {Math.floor(window.scrollY / window.innerWidth)}
        	</div>
        	<ImagesView
        		images={this.props.images}
        		containerHeight={window.innerHeight}
        		itemHeight={window.innerWidth}
        		type={'full'}
        		zIndex={3}
        		scrollY={this.state.scrollY}
        		buffer={1}
        	/>
        	<ImagesView
        		images={this.props.images}
        		containerHeight={window.innerHeight}
        		itemHeight={window.innerWidth}
        		type={'thumb'}
        		zIndex={2}
        		scrollY={this.state.scrollY}
        		buffer={5}
        	/>
        	<ImagesView
        		images={this.props.images}
        		containerHeight={window.innerHeight}
        		itemHeight={window.innerWidth}
        		type={'color'}
        		zIndex={1}
        		scrollY={this.state.scrollY}
        		buffer={10}
        	/>
        </div>
    }
}

class ImagesView extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			inDom: this.calcInDomItems(props),
			zIndex: this.props.zIndex,
			scrollY: this.props.scrollY
		};
	}

	componentWillReceiveProps(newProps) {
 		this.setState({
			inDom: this.calcInDomItems(newProps),
			zIndex: newProps.zIndex,
			scrollY: newProps.scrollY
 		});
	}

	calcInDomItems(props) {
		const first = Math.floor(props.scrollY / props.itemHeight);
		const perPage = Math.ceil(props.containerHeight / props.itemHeight) + 1;

		return props.images.slice(
			Math.max(first - props.buffer, 0),
			Math.min(
				first + perPage + props.buffer,
				props.images.length
			)
		);
	}

	render() {
    	const style = {
			height: `calc(100vw * ${this.props.images.length})`,
			fontSize: 0,
			zIndex: this.props.zIndex,
			position: 'absolute',
			top: 0,
			left: 0
    	};

    	const topBase = Math.max(0, (Math.floor(this.props.scrollY / this.props.itemHeight) - this.props.buffer) * this.props.itemHeight)

		return <div style={style}>
			{this.state.inDom.map((image, index) => {
				if (this.props.type === 'full') {
					return <MyImageComp src={image.standard_resolution.url} top={topBase} key={image.standard_resolution.url} />
				} else if (this.props.type === 'thumb') {
					return <MyImageComp src={image.thumbnail.url} top={topBase} key={image.thumbnail.url} />
				} else {
					return <MyPlaceholderComp top={topBase} color={image.prominentColor} key={image.prominentColor} />
				}
			})}
        </div>
	}
}
