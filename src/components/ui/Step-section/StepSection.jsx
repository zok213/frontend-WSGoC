import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import "./step-section.css";

const STEP__DATA = [
  {
    title: "Submit Your Idea",
    desc: "Teams create a visual representation of their game-on-chain idea, such as a slide or drawing, and add a title and description. ",
    icon: "ri-chat-upload-line",
  },

  {
    title: "Explore Other Ideas",
    desc: "Browse through submissions from other teams to discover unique and innovative game-on-chain concepts. ",
    icon: "ri-layout-masonry-line",
  },

  {
    title: "Cast Your Vote",
    desc: "After exploring, use your allocated tokens to vote for your favorite ideas. Judges receive 5 tokens each, while participants receive 2 tokens each.",
    icon: "ri-image-line",
  },

  {
    title: "Track the Rankings",
    desc: "Watch ideas climb the leaderboard in real-time based on voting results. See which teams are gaining the most support and feedback.",
    icon: "ri-list-check",
  },
];

const StepSection = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-4">
            <h3 className="step__title">Create and share your ideas</h3>
          </Col>

          {STEP__DATA.map((item, index) => (
            <Col lg="3" md="4" sm="6" key={index} className="mb-4">
              <div className="single__step__item">
                <span>
                  <i class={item.icon}></i>
                </span>
                <div className="step__item__content">
                  <h5>
                    <Link to="#">{item.title}</Link>
                  </h5>
                  <p className="mb-0">{item.desc}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StepSection;
