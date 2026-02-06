import React from "react";

import "./style.css";

const SoundWave = ({ progress, isPlaying }) => {
	return (
		<div className={`sw ${isPlaying ? "" : "sw--pause"}`}>
			<div className="sw-oscilloscope">
				{/* CRT scan lines overlay */}
				<div className="sw-scanlines" />

				{/* The waveform layers - cyan and red for chromatic aberration */}
				<svg className="sw-wave sw-wave--red" viewBox="0 0 200 40" preserveAspectRatio="none">
					<path className="sw-wave-path" d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20" />
				</svg>
				<svg className="sw-wave sw-wave--main" viewBox="0 0 200 40" preserveAspectRatio="none">
					<path className="sw-wave-path" d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20" />
				</svg>
				<svg className="sw-wave sw-wave--cyan" viewBox="0 0 200 40" preserveAspectRatio="none">
					<path className="sw-wave-path" d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20" />
				</svg>

				{/* Glitch corruption blocks */}
				<div className="sw-glitch-block sw-glitch-block--1" />
				<div className="sw-glitch-block sw-glitch-block--2" />
				<div className="sw-glitch-block sw-glitch-block--3" />
				<div className="sw-glitch-block sw-glitch-block--4" />
				<div className="sw-glitch-block sw-glitch-block--5" />
				<div className="sw-glitch-block sw-glitch-block--6" />

				{/* Horizontal tear lines */}
				<div className="sw-tear sw-tear--1" />
				<div className="sw-tear sw-tear--2" />

				{/* Progress indicator */}
				<div className="sw-progress" style={{ "--progress": `${progress}%` }}>
					<div className="sw-progress-head" />
				</div>
			</div>

			{/* Time track */}
			<div className="sw-time-track" style={{ "--progress": `${progress}%` }} />
		</div>
	);
};

export default SoundWave;
