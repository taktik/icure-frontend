const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="table-style">
	<template>
		<style is="custom-style">
			:host {
				--mdc-theme-primary: var(--app-secondary-color);
			}
            .mdc-touch-target-wrapper {
				display: inline;
			}

			@-webkit-keyframes mdc-checkbox-unchecked-checked-checkmark-path {
			0%, 50% {
				stroke-dashoffset: 29.7833385;
			}
			50% {
				-webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
						animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
			}
			100% {
				stroke-dashoffset: 0;
			}
			}

			@keyframes mdc-checkbox-unchecked-checked-checkmark-path {
			0%, 50% {
				stroke-dashoffset: 29.7833385;
			}
			50% {
				-webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
						animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
			}
			100% {
				stroke-dashoffset: 0;
			}
			}
			@-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
			0%, 68.2% {
				-webkit-transform: scaleX(0);
						transform: scaleX(0);
			}
			68.2% {
				-webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1);
						animation-timing-function: cubic-bezier(0, 0, 0, 1);
			}
			100% {
				-webkit-transform: scaleX(1);
						transform: scaleX(1);
			}
			}
			@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
			0%, 68.2% {
				-webkit-transform: scaleX(0);
						transform: scaleX(0);
			}
			68.2% {
				-webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1);
						animation-timing-function: cubic-bezier(0, 0, 0, 1);
			}
			100% {
				-webkit-transform: scaleX(1);
						transform: scaleX(1);
			}
			}
			@-webkit-keyframes mdc-checkbox-checked-unchecked-checkmark-path {
			from {
				-webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
						animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
				opacity: 1;
				stroke-dashoffset: 0;
			}
			to {
				opacity: 0;
				stroke-dashoffset: -29.7833385;
			}
			}
			@keyframes mdc-checkbox-checked-unchecked-checkmark-path {
			from {
				-webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
						animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
				opacity: 1;
				stroke-dashoffset: 0;
			}
			to {
				opacity: 0;
				stroke-dashoffset: -29.7833385;
			}
			}
			@-webkit-keyframes mdc-checkbox-checked-indeterminate-checkmark {
			from {
				-webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
						animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
				-webkit-transform: rotate(0deg);
						transform: rotate(0deg);
				opacity: 1;
			}
			to {
				-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
				opacity: 0;
			}
			}
			@keyframes mdc-checkbox-checked-indeterminate-checkmark {
			from {
				-webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
						animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
				-webkit-transform: rotate(0deg);
						transform: rotate(0deg);
				opacity: 1;
			}
			to {
				-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
				opacity: 0;
			}
			}
			@-webkit-keyframes mdc-checkbox-indeterminate-checked-checkmark {
			from {
				-webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
						animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
				-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
				opacity: 0;
			}
			to {
				-webkit-transform: rotate(360deg);
						transform: rotate(360deg);
				opacity: 1;
			}
			}
			@keyframes mdc-checkbox-indeterminate-checked-checkmark {
			from {
				-webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
						animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
				-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
				opacity: 0;
			}
			to {
				-webkit-transform: rotate(360deg);
						transform: rotate(360deg);
				opacity: 1;
			}
			}
			@-webkit-keyframes mdc-checkbox-checked-indeterminate-mixedmark {
			from {
				-webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;
						animation-timing-function: mdc-animation-deceleration-curve-timing-function;
				-webkit-transform: rotate(-45deg);
						transform: rotate(-45deg);
				opacity: 0;
			}
			to {
				-webkit-transform: rotate(0deg);
						transform: rotate(0deg);
				opacity: 1;
			}
			}
			@keyframes mdc-checkbox-checked-indeterminate-mixedmark {
			from {
				-webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;
						animation-timing-function: mdc-animation-deceleration-curve-timing-function;
				-webkit-transform: rotate(-45deg);
						transform: rotate(-45deg);
				opacity: 0;
			}
			to {
				-webkit-transform: rotate(0deg);
						transform: rotate(0deg);
				opacity: 1;
			}
			}
			@-webkit-keyframes mdc-checkbox-indeterminate-checked-mixedmark {
			from {
				-webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
						animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
				-webkit-transform: rotate(0deg);
						transform: rotate(0deg);
				opacity: 1;
			}
			to {
				-webkit-transform: rotate(315deg);
						transform: rotate(315deg);
				opacity: 0;
			}
			}
			@keyframes mdc-checkbox-indeterminate-checked-mixedmark {
			from {
				-webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
						animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
				-webkit-transform: rotate(0deg);
						transform: rotate(0deg);
				opacity: 1;
			}
			to {
				-webkit-transform: rotate(315deg);
						transform: rotate(315deg);
				opacity: 0;
			}
			}
			@-webkit-keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
			0% {
				-webkit-animation-timing-function: linear;
						animation-timing-function: linear;
				-webkit-transform: scaleX(1);
						transform: scaleX(1);
				opacity: 1;
			}
			32.8%, 100% {
				-webkit-transform: scaleX(0);
						transform: scaleX(0);
				opacity: 0;
			}
			}
			@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
			0% {
				-webkit-animation-timing-function: linear;
						animation-timing-function: linear;
				-webkit-transform: scaleX(1);
						transform: scaleX(1);
				opacity: 1;
			}
			32.8%, 100% {
				-webkit-transform: scaleX(0);
						transform: scaleX(0);
				opacity: 0;
			}
			}
			.mdc-checkbox {
				display: inline-block;
				position: relative;
				flex: 0 0 16px;
				box-sizing: content-box;
				width: 16px;
				height: 16px;
				line-height: 0;
				white-space: nowrap;
				cursor: pointer;
				vertical-align: bottom;
				padding: 4px;
			}
			.mdc-checkbox .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background::before,
			.mdc-checkbox .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background::before {
				background-color: #018786;
			}
			@supports not (-ms-ime-align: auto) {
				.mdc-checkbox .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background::before,
				.mdc-checkbox .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background::before {
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
			}
			.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before, .mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after {
				background-color: #018786;
			}
			@supports not (-ms-ime-align: auto) {
				.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before, .mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after {
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
			}
			.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before {
				opacity: 0.04;
			}
			.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before, .mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before {
				transition-duration: 75ms;
				opacity: 0.12;
			}
			.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after {
				transition: opacity 150ms linear;
			}
			.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after {
				transition-duration: 75ms;
				opacity: 0.12;
			}
			.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded {
				--mdc-ripple-fg-opacity: 0.12;
			}
			.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after {
				background-color: #018786;
			}
			@supports not (-ms-ime-align: auto) {
				.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,
				.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after {
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
			}
			.mdc-checkbox .mdc-checkbox__background {
				top: 4px;
				left: 4px;
			}
			.mdc-checkbox .mdc-checkbox__background::before {
				top: -8px;
				left: -8px;
				width: 28px;
				height: 28px;
			}
			.mdc-checkbox .mdc-checkbox__native-control {
				top: 0px;
				right: 0;
				left: 0;
				width: 16px;
				height: 16px;
				margin: 0;
				opacity: 0;
			}

			.mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background {
				border-color: rgba(0, 0, 0, 0.54);
				background-color: transparent;
			}

			.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
			.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
				border-color: #018786;
				/* @alternate */
				border-color: var(--mdc-theme-secondary, #018786);
				background-color: #018786;
				/* @alternate */
				background-color: var(--mdc-theme-secondary, #018786);
			}

			@-webkit-keyframes mdc-checkbox-fade-in-background-u2nmdls {
				0% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
				50% {
					border-color: #018786;
					/* @alternate */
					border-color: var(--mdc-theme-secondary, #018786);
					background-color: #018786;
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
			}

			@keyframes mdc-checkbox-fade-in-background-u2nmdls {
				0% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
				50% {
					border-color: #018786;
					/* @alternate */
					border-color: var(--mdc-theme-secondary, #018786);
					background-color: #018786;
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
			}
			@-webkit-keyframes mdc-checkbox-fade-out-background-u2nmdls {
				0%, 80% {
					border-color: #018786;
					/* @alternate */
					border-color: var(--mdc-theme-secondary, #018786);
					background-color: #018786;
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
				100% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
			}
			@keyframes mdc-checkbox-fade-out-background-u2nmdls {
				0%, 80% {
					border-color: #018786;
					/* @alternate */
					border-color: var(--mdc-theme-secondary, #018786);
					background-color: #018786;
					/* @alternate */
					background-color: var(--mdc-theme-secondary, #018786);
				}
				100% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
			}
			.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {
				-webkit-animation-name: mdc-checkbox-fade-in-background-u2nmdls;
						animation-name: mdc-checkbox-fade-in-background-u2nmdls;
			}
			.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {
				-webkit-animation-name: mdc-checkbox-fade-out-background-u2nmdls;
						animation-name: mdc-checkbox-fade-out-background-u2nmdls;
			}

			.mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background {
				border-color: rgba(0, 0, 0, 0.26);
				background-color: transparent;
			}

			.mdc-checkbox__native-control[disabled]:checked ~ .mdc-checkbox__background,
			.mdc-checkbox__native-control[disabled]:indeterminate ~ .mdc-checkbox__background {
				border-color: transparent;
				background-color: rgba(0, 0, 0, 0.26);
			}

			.mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background .mdc-checkbox__checkmark {
				color: #fff;
			}
			.mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background .mdc-checkbox__mixedmark {
				border-color: #fff;
			}

			.mdc-checkbox__native-control:disabled ~ .mdc-checkbox__background .mdc-checkbox__checkmark {
				color: #fff;
			}
			.mdc-checkbox__native-control:disabled ~ .mdc-checkbox__background .mdc-checkbox__mixedmark {
				border-color: #fff;
			}

			@media screen and (-ms-high-contrast: active) {
				.mdc-checkbox__mixedmark {
					margin: 0 1px;
				}
			}

			.mdc-checkbox--disabled {
				cursor: default;
				pointer-events: none;
			}

			.mdc-checkbox__background {
				display: inline-flex;
				position: absolute;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				width: 16px;
				height: 16px;
				border: 2px solid currentColor;
				border-radius: 2px;
				background-color: transparent;
				pointer-events: none;
				will-change: background-color, border-color;
				transition: background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
			}
			.mdc-checkbox__background .mdc-checkbox__background::before {
				background-color: #000;
			}
			@supports not (-ms-ime-align: auto) {
				.mdc-checkbox__background .mdc-checkbox__background::before {
					/* @alternate */
					background-color: var(--mdc-theme-on-surface, #000);
				}
			}

			.mdc-checkbox__checkmark {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				opacity: 0;
				transition: opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
			}
			.mdc-checkbox--upgraded .mdc-checkbox__checkmark {
				opacity: 1;
			}

			.mdc-checkbox__checkmark-path {
				transition: stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
				stroke: currentColor;
				stroke-width: 3.12px;
				stroke-dashoffset: 29.7833385;
				stroke-dasharray: 29.7833385;
			}

			.mdc-checkbox__mixedmark {
				width: 100%;
				height: 0;
				transform: scaleX(0) rotate(0deg);
				border-width: 1px;
				border-style: solid;
				opacity: 0;
				transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
			}

			.mdc-checkbox--upgraded .mdc-checkbox__background,
			.mdc-checkbox--upgraded .mdc-checkbox__checkmark,
			.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,
			.mdc-checkbox--upgraded .mdc-checkbox__mixedmark {
				transition: none !important;
			}

			.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background, .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background, .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background, .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {
				animation-duration: 180ms;
				animation-timing-function: linear;
			}
			.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
				animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
				animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
				animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
				animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
				animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
				animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
				animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;
				transition: none;
			}
			.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
				animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;
				transition: none;
			}

			.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
			.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
				transition: border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1);
			}
			.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background .mdc-checkbox__checkmark-path,
			.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background .mdc-checkbox__checkmark-path {
				stroke-dashoffset: 0;
			}

			.mdc-checkbox__background::before {
				position: absolute;
				transform: scale(0, 0);
				border-radius: 50%;
				opacity: 0;
				pointer-events: none;
				content: "";
				will-change: opacity, transform;
				transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
			}

			.mdc-checkbox__native-control:focus ~ .mdc-checkbox__background::before {
				transform: scale(1);
				opacity: 0.12;
				transition: opacity 80ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 80ms 0ms cubic-bezier(0, 0, 0.2, 1);
			}

			.mdc-checkbox__native-control {
				top: 4px;
				right: 2px;
				left: 4px;
				width: 16px;
				height: 16px;
			}
			.mdc-checkbox__native-control:disabled {
				cursor: default;
				pointer-events: none;
			}

			.mdc-checkbox--touch {
				margin-top: 4px;
				margin-bottom: 4px;
				margin-right: 4px;
				margin-left: 4px;
			}
			.mdc-checkbox--touch .mdc-checkbox__native-control {
				top: -4px;
				right: -4px;
				left: -4px;
				width: 48px;
				height: 48px;
			}

			.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background .mdc-checkbox__checkmark {
				transition: opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1), transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);
				opacity: 1;
			}
			.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background .mdc-checkbox__mixedmark {
				transform: scaleX(1) rotate(-45deg);
			}

			.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background .mdc-checkbox__checkmark {
				transform: rotate(45deg);
				opacity: 0;
				transition: opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
			}
			.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background .mdc-checkbox__mixedmark {
				transform: scaleX(1) rotate(0deg);
				opacity: 1;
			}

			@-webkit-keyframes mdc-ripple-fg-radius-in {
				from {
					animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
					transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);
				}
				to {
					transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
				}
			}

			@keyframes mdc-ripple-fg-radius-in {
				from {
					animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
					transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);
				}
				to {
					transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
				}
			}
			@-webkit-keyframes mdc-ripple-fg-opacity-in {
				from {
					animation-timing-function: linear;
					opacity: 0;
				}
				to {
					opacity: var(--mdc-ripple-fg-opacity, 0);
				}
			}
			@keyframes mdc-ripple-fg-opacity-in {
				from {
					animation-timing-function: linear;
					opacity: 0;
				}
				to {
					opacity: var(--mdc-ripple-fg-opacity, 0);
				}
			}
			@-webkit-keyframes mdc-ripple-fg-opacity-out {
				from {
					animation-timing-function: linear;
					opacity: var(--mdc-ripple-fg-opacity, 0);
				}
				to {
					opacity: 0;
				}
			}
			@keyframes mdc-ripple-fg-opacity-out {
			from {
				animation-timing-function: linear;
				opacity: var(--mdc-ripple-fg-opacity, 0);
			}
			to {
				opacity: 0;
			}
			}
			.mdc-ripple-surface--test-edge-var-bug {
				--mdc-ripple-surface-test-edge-var: 1px solid #000;
				visibility: hidden;
			}
			.mdc-ripple-surface--test-edge-var-bug::before {
				border: var(--mdc-ripple-surface-test-edge-var);
			}

			.mdc-checkbox {
				--mdc-ripple-fg-size: 0;
				--mdc-ripple-left: 0;
				--mdc-ripple-top: 0;
				--mdc-ripple-fg-scale: 1;
				--mdc-ripple-fg-translate-end: 0;
				--mdc-ripple-fg-translate-start: 0;
				-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			}
			.mdc-checkbox .mdc-checkbox__ripple::before,
			.mdc-checkbox .mdc-checkbox__ripple::after {
				position: absolute;
				border-radius: 50%;
				opacity: 0;
				pointer-events: none;
				content: "";
			}
			.mdc-checkbox .mdc-checkbox__ripple::before {
				transition: opacity 15ms linear, background-color 15ms linear;
				z-index: 1;
			}
			.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple::before {
				transform: scale(var(--mdc-ripple-fg-scale, 1));
			}
			.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple::after {
				top: 0;
				/* @noflip */
				left: 0;
				transform: scale(0);
				transform-origin: center center;
			}
			.mdc-checkbox.mdc-ripple-upgraded--unbounded .mdc-checkbox__ripple::after {
				top: var(--mdc-ripple-top, 0);
				/* @noflip */
				left: var(--mdc-ripple-left, 0);
			}
			.mdc-checkbox.mdc-ripple-upgraded--foreground-activation .mdc-checkbox__ripple::after {
					animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;
			}
			.mdc-checkbox.mdc-ripple-upgraded--foreground-deactivation .mdc-checkbox__ripple::after {
				animation: mdc-ripple-fg-opacity-out 150ms;
				transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
			}
			.mdc-checkbox .mdc-checkbox__ripple::before, .mdc-checkbox .mdc-checkbox__ripple::after {
				background-color: #000;
			}
			@supports not (-ms-ime-align: auto) {
				.mdc-checkbox .mdc-checkbox__ripple::before, .mdc-checkbox .mdc-checkbox__ripple::after {
					/* @alternate */
					background-color: var(--mdc-theme-on-surface, #000);
				}
			}
			.mdc-checkbox:hover .mdc-checkbox__ripple::before {
				opacity: 0.04;
			}
			.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before, .mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before {
				transition-duration: 75ms;
				opacity: 0.12;
			}
			.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after {
				transition: opacity 150ms linear;
			}
			.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after {
				transition-duration: 75ms;
				opacity: 0.12;
			}
			.mdc-checkbox.mdc-ripple-upgraded {
				--mdc-ripple-fg-opacity: 0.12;
			}
			.mdc-checkbox .mdc-checkbox__ripple::before,
			.mdc-checkbox .mdc-checkbox__ripple::after {
				top: calc(50% - 50%);
				/* @noflip */
				left: calc(50% - 50%);
				width: 100%;
				height: 100%;
			}
			.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple::before,
			.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple::after {
				top: var(--mdc-ripple-top, calc(50% - 50%));
				/* @noflip */
				left: var(--mdc-ripple-left, calc(50% - 50%));
				width: var(--mdc-ripple-fg-size, 100%);
				height: var(--mdc-ripple-fg-size, 100%);
			}
			.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple::after {
				width: var(--mdc-ripple-fg-size, 100%);
				height: var(--mdc-ripple-fg-size, 100%);
			}

			.mdc-checkbox__ripple {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;
			}

			.mdc-ripple-upgraded--background-focused .mdc-checkbox__background::before {
				content: none;
			}

			.mdc-data-table__content {
				font-family: Roboto, sans-serif;
				-moz-osx-font-smoothing: grayscale;
				-webkit-font-smoothing: antialiased;
				font-size: var(--font-size-normal);
				line-height: ;
				font-weight: 400;
				letter-spacing: 0.0178571429em;
				text-decoration: inherit;
				text-transform: inherit;
			}

			.mdc-data-table {
				background-color: #fff;
				/* @alternate */
				background-color: var(--mdc-theme-surface, #fff);
				border-radius: 4px;
				border-width: 1px;
				border-style: solid;
				border-color: var(--app-background-color-dark, rgba(0, 0, 0, 0.12));
				display: -ms-inline-flexbox;
				flex-direction: column;
				box-sizing: border-box;
				overflow-x: auto;
			}
			.mdc-data-table__row {
				background-color: inherit;
				border-top-color: var(--app-background-color-dark, rgba(0, 0, 0, 0.12));
				border-top-width: 1px;
				border-top-style: solid;
			}

			.mdc-data-table__header-row {
				background-color: inherit;
			}

			.mdc-data-table__row--selected {
				background-color: rgba(255, 0, 80, 0.04);
			}

			.mdc-data-table__row:not(.mdc-data-table__row--selected):hover {
				background-color: var(--app-background-color, rgba(0, 0, 0, 0.04));
			}

			.mdc-data-table__cell,
			.mdc-data-table__header-cell {
				padding-right: 12px;
				padding-left: 12px;
			}

			.mdc-data-table__header-cell--checkbox,
			.mdc-data-table__cell--checkbox {
				/* @noflip */
				padding-left: 12px;
				/* @noflip */
				padding-right: 2px;
				width: 34px;
			}
			[dir=rtl] .mdc-data-table__header-cell--checkbox, .mdc-data-table__header-cell--checkbox[dir=rtl],
			[dir=rtl] .mdc-data-table__cell--checkbox,
			.mdc-data-table__cell--checkbox[dir=rtl] {
				/* @noflip */
				padding-left: 0;
				/* @noflip */
				padding-right: 12px;
			}

			.mdc-data-table__table {
				min-width: 100%;
				border: 0;
				white-space: nowrap;
				border-collapse: collapse;
				/**
				* With table-layout:fixed, table and column widths are defined by the width
				* of the first row of cells. Cells in subsequent rows do not affect column
				* widths. This results in a predictable table layout and may also speed up
				* rendering.
				*/
				table-layout: fixed;
			}

			.mdc-data-table__cell {
				font-family: Roboto, sans-serif;
				font-size: var(--font-size-normal);
				line-height: var(--font-size-normal);
				font-weight: 400;
				letter-spacing: 0.0178571429em;
				text-decoration: inherit;
				text-transform: inherit;
				box-sizing: border-box;
				text-overflow: ellipsis;
				overflow: hidden;
				color: rgba(0, 0, 0, 0.87);
				height: 28px;
			}

			.mdc-data-table__cell--numeric {
				text-align: right;
			}
			[dir=rtl] .mdc-data-table__cell--numeric, .mdc-data-table__cell--numeric[dir=rtl] {
				/* @noflip */
				text-align: left;
			}

			.mdc-data-table__header-cell {
				font-family: Roboto, sans-serif;
				font-size: var(--font-size-large);
				line-height: var(--font-size-large);
				font-weight: 500;
				letter-spacing: 0.0071428571em;
				text-decoration: inherit;
				text-transform: inherit;
				box-sizing: border-box;
				text-align: left;
				text-overflow: ellipsis;
				overflow: hidden;
				color: rgba(0, 0, 0, 0.87);
				height: 32px;
			}
			[dir=rtl] .mdc-data-table__header-cell, .mdc-data-table__header-cell[dir=rtl] {
				/* @noflip */
				text-align: right;
			}

			.mdc-data-table__header-cell--center {
				text-align: center;
			}

			.mdc-data-table__header-cell--numeric {
				text-align: right;
			}
			[dir=rtl] .mdc-data-table__header-cell--numeric, .mdc-data-table__header-cell--numeric[dir=rtl] {
				/* @noflip */
				text-align: left;
			}

			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background::before,
			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background::before,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background::before,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background::before {
				background-color: var(--app-secondary-color);
			}
			@supports not (-ms-ime-align: auto) {
			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background::before,
			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background::before,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background::before,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background::before {
				/* @alternate */
				background-color: var(--mdc-theme-primary, var(--app-secondary-color));
			}
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before, .mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after {
				background-color: var(--app-secondary-color);
			}
			@supports not (-ms-ime-align: auto) {
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before, .mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after {
				/* @alternate */
				background-color: var(--mdc-theme-primary, var(--app-secondary-color));
			}
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before {
				opacity: 0.04;
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before, .mdc-data-table__header-row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before {
				transition-duration: 75ms;
				opacity: 0.12;
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after {
				transition: opacity 150ms linear;
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after {
				transition-duration: 75ms;
				opacity: 0.12;
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded,
			.mdc-data-table__row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded {
				--mdc-ripple-fg-opacity: 0.12;
			}
			.mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after,
			.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after {
				background-color: var(--app-secondary-color);
			}
			@supports not (-ms-ime-align: auto) {
			.mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after,
			.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,
			.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after {
				/* @alternate */
				background-color: var(--mdc-theme-primary, var(--app-secondary-color));
			}
			}
			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate) ~ .mdc-checkbox__background {
				border-color: rgba(0, 0, 0, 0.54);
				background-color: transparent;
			}
			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
			.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox .mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
				border-color: var(--app-secondary-color);
				/* @alternate */
				border-color: var(--mdc-theme-primary, var(--app-secondary-color));
				background-color: var(--app-secondary-color);
				/* @alternate */
				background-color: var(--mdc-theme-primary, var(--app-secondary-color));
			}
			@-webkit-keyframes mdc-checkbox-fade-in-background-u2nmdm2 {
				0% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
				50% {
					border-color: var(--app-secondary-color);
					/* @alternate */
					border-color: var(--mdc-theme-primary, var(--app-secondary-color));
					background-color: var(--app-secondary-color);
					/* @alternate */
					background-color: var(--mdc-theme-primary, var(--app-secondary-color));
				}
			}
			@keyframes mdc-checkbox-fade-in-background-u2nmdm2 {
				0% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
				50% {
					border-color: var(--app-secondary-color);
					/* @alternate */
					border-color: var(--mdc-theme-primary, var(--app-secondary-color));
					background-color: var(--app-secondary-color);
					/* @alternate */
					background-color: var(--mdc-theme-primary, var(--app-secondary-color));
				}
			}
			@-webkit-keyframes mdc-checkbox-fade-out-background-u2nmdm2 {
				0%, 80% {
					border-color: var(--app-secondary-color);
					/* @alternate */
					border-color: var(--mdc-theme-primary, var(--app-secondary-color));
					background-color: var(--app-secondary-color);
					/* @alternate */
					background-color: var(--mdc-theme-primary, var(--app-secondary-color));
				}
				100% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
			}
			@keyframes mdc-checkbox-fade-out-background-u2nmdm2 {
				0%, 80% {
					border-color: var(--app-secondary-color);
					/* @alternate */
					border-color: var(--mdc-theme-primary, var(--app-secondary-color));
					background-color: var(--app-secondary-color);
					/* @alternate */
					background-color: var(--mdc-theme-primary, var(--app-secondary-color));
				}
				100% {
					border-color: rgba(0, 0, 0, 0.54);
					background-color: transparent;
				}
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-data-table__header-row-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {
				animation-name: mdc-checkbox-fade-in-background-u2nmdm2;
			}
			.mdc-data-table__header-row-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background, .mdc-data-table__header-row-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background,
			.mdc-data-table__row-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {
				animation-name: mdc-checkbox-fade-out-background-u2nmdm2;
			}

			.demo-data-table-header {
				font-family: Roboto, sans-serif;
				font-size: 1rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0.009375em;
				text-decoration: inherit;
				text-transform: inherit;
				margin-top: 32px;
			}
        </style>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
