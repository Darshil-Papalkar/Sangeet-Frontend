// for related artists
import Slider from 'react-slick';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import React, { useContext } from "react";

import { Artists } from "../../pages/Album";
import { apiLinks } from "../../connection.config";

import "./footer.css";

const settings = {
    dots: false,
    arrows: false,
    draggable: true,
    lazyLoad: "ondemand",
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    swipeToSlide: true,
    easing: "linear",
    responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 5,
          }
        },
        {
            breakpoint: 991,
            settings: {
              slidesToShow: 4,
            }
          },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2
          }
        },
        {
            breakpoint: 300,
            settings: {
              slidesToShow: 1
            }
        },
    ]
};

const Footer = (props) => {

    let artistList = useContext(Artists);
    artistList = artistList?.filter(artist => artist !== "Various Artists");

    return (
        <React.Fragment>
            <Container key="artist-container" className="mt-5">
                { artistList.length ? 
                    <Container className="slider-container">
                        <h2 className="category-list-heading" title="Artists">Album Artists</h2>
                        <Slider {...settings}>
                        { artistList.map((artist, id) => {
                            return (
                                <div key={id} className="mt-3 mb-3 custom-card-items">
                                    <div className="artist-card-image-container">
                                        <img 
                                            src={apiLinks.getArtistImgFromName + artist} 
                                            alt={artist} 
                                            className="artist-card-image"
                                        />
                                    </div>
                                    <div className="card-text-container">
                                        <div className="card-text" style={{textAlign: "center"}}>
                                            <h4 className="pt-3 pb-3 artist-name" title={artist}>
                                                <Link to={`/artist/${artist}`} className='artist-name'>
                                                    {artist}
                                                </Link>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        </Slider>
                    </Container>
                 : <React.Fragment /> }
            </Container>
            <Container className="pt-3" fluid />
        </React.Fragment>
    );
};

export default Footer;