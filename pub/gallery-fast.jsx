// object-fit: contain;
// width 100vw

const ImageComp = React.createClass({
	render() {
		const style = {
			width: '100vw',
			objectFit: 'contain'
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
		console.log('scroll')
		this.setState({
			inDomItems: this.calcInDomItems()
		});
	}


    render() {
    	const style = {
			height: `calc(100vw * ${this.props.images.length})`,
			fontSize: 0
    	};

    	const pusherStyle = {
        	height: Math.floor(window.scrollY / window.innerWidth) * window.innerWidth
    	};

        return <div id="gallery" className="fast" style={style}>
        	<div style={pusherStyle}></div>
            {
            	_.map(this.state.inDomItems, image => (<ImageComp image={image} />))
            }
        </div>
    }
}
