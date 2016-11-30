// object-fit: contain;
// width 100vw

const ImageComp = React.createClass({
	render() {
		const style = {
			width: '100vw',
			objectFit: 'contain',
			transform: `translateY(${this.props.top}px)`,
			willChange: 'transform'
		};

		return <img src={this.props.image.low_resolution.url} style={style} />
	}
});

class galleryComp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scrollY: window.scrollY
		};

		this.onScrollHandler = this.onScrollHandler.bind(this);
	}

	// calcInDomItems(buffer) {
	// 	return this.props.images.slice(
	// 		Math.max(Math.floor(window.scrollY / window.innerWidth) - buffer),
	// 		Math.floor(window.scrollY / window.innerWidth) + Math.ceil(window.innerHeight / window.innerWidth) + 1
	// 	);
	// }

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
        		type={''}
        		zIndex={1}
        		scrollY={this.state.scrollY}
        		buffer={5}
        	/>
            {
            	// _.map(this.state.inDomItems, (image, index) => (<ImageComp image={image} top={topBase} />))
            }
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

		// console.log(first, perPage);

		// console.log(		Math.max(first - props.buffer, 0),
		// 	Math.min(
		// 		first + perPage + props.buffer,
		// 		props.images.length
		// 	))

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
			fontSize: 0
    	};

    	const topBase = Math.max(0, (Math.floor(this.props.scrollY / this.props.itemHeight) - this.props.buffer) * this.props.itemHeight)

		return <div style={style}>
			{this.state.inDom.map((image, index) => {
				return <ImageComp image={image} top={topBase} />
			})}
        </div>
	}
}
