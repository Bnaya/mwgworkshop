// object-fit: contain;
// width 100vw

const ImageComp = React.createClass({
	render() {
		const style = {
			width: '100vw',
			objectFit: 'contain',
			transform: `translateY(${this.props.top}px)`
		};

		return <img src={this.props.image.low_resolution.url} style={style} />
	}
});

class galleryComp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inDomItems: this.calcInDomItems()
		};

		this.onScrollHandler = this.onScrollHandler.bind(this);
	}

	calcInDomItems() {
		return this.props.images.slice(
			Math.floor(window.scrollY / window.innerWidth),
			Math.floor(window.scrollY / window.innerWidth) + Math.ceil(window.innerHeight / window.innerWidth) + 1
		);
	}

	componentWillMount() {
		window.addEventListener('scroll', this.onScrollHandler);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScrollHandler);
	}

	onScrollHandler(e) {
		this.setState({
			inDomItems: this.calcInDomItems()
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
            {
            	_.map(this.state.inDomItems, (image, index) => (<ImageComp image={image} top={topBase} />))
            }
        </div>
    }
}
