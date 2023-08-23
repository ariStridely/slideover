<?php

namespace LivewireUI\Slideover;

use InvalidArgumentException;
use Livewire\Component;
use LivewireUI\Slideover\Contracts\SlideoverComponent as Contract;

abstract class SlideoverComponent extends Component implements Contract
{
    public bool $forceClose = false;

    public int $skipSlideovers = 0;

    public bool $destroySkipped = false;

    protected static array $maxWidths = [
        'sm' => 'sm:max-w-sm',
        'md' => 'sm:max-w-md',
        'lg' => 'sm:max-w-md md:max-w-lg',
        'xl' => 'sm:max-w-md md:max-w-xl',
        '2xl' => 'sm:max-w-md md:max-w-xl lg:max-w-2xl',
        '3xl' => 'sm:max-w-md md:max-w-xl lg:max-w-3xl',
        '4xl' => 'sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl',
        '5xl' => 'sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl',
        '6xl' => 'sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl',
        '7xl' => 'sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-7xl',
    ];

    public function destroySkippedSlideovers(): self
    {
        $this->destroySkipped = true;

        return $this;
    }

    public function skipPreviousSlideovers($count = 1, $destroy = false): self
    {
        $this->skipPreviousSlideover($count, $destroy);

        return $this;
    }

    public function skipPreviousSlideover($count = 1, $destroy = false): self
    {
        $this->skipSlideovers = $count;
        $this->destroySkipped = $destroy;

        return $this;
    }

    public function forceClose(): self
    {
        $this->forceClose = true;

        return $this;
    }

    public function closeSlideover(): void
    {
        $this->dispatch('closeSlideover', force: $this->forceClose, skipPreviousSlideovers: $this->skipSlideovers, destroySkipped: $this->destroySkipped);
    }

    public function closeSlideoverWithEvents(array $events): void
    {
        $this->emitSlideoverEvents($events);
        $this->closeSlideover();
    }

    public static function slideoverMaxWidth(): string
    {
        return config('wire-elements-slideover.component_defaults.slideover_max_width', '2xl');
    }

    public static function slideoverMaxWidthClass(): string
    {
        if (! array_key_exists(static::slideoverMaxWidth(), static::$maxWidths)) {
            throw new InvalidArgumentException(
                sprintf('Slideover max width [%s] is invalid. The width must be one of the following [%s].',
                    static::slideoverMaxWidth(), implode(', ', array_keys(static::$maxWidths))),
            );
        }

        return static::$maxWidths[static::slideoverMaxWidth()];
    }

    public static function closeSlideoverOnClickAway(): bool
    {
        return config('wire-elements-slideover.component_defaults.close_slideover_on_click_away', true);
    }

    public static function closeSlideoverOnEscape(): bool
    {
        return config('wire-elements-slideover.component_defaults.close_slideover_on_escape', true);
    }

    public static function closeSlideoverOnEscapeIsForceful(): bool
    {
        return config('wire-elements-slideover.component_defaults.close_slideover_on_escape_is_forceful', true);
    }

    public static function dispatchCloseEvent(): bool
    {
        return config('wire-elements-slideover.component_defaults.dispatch_close_event', false);
    }

    public static function destroyOnClose(): bool
    {
        return config('wire-elements-slideover.component_defaults.destroy_on_close', false);
    }

    private function emitSlideoverEvents(array $events): void
    {
        foreach ($events as $component => $event) {
            if (is_array($event)) {
                [$event, $params] = $event;
            }

            if (is_numeric($component)) {
                $this->dispatch($event, ...$params ?? []);
            } else {
                $this->dispatch($event, ...$params ?? [])->to($component);
            }
        }
    }
}
